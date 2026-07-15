import { AppFile } from "./AppFile";
import { FilesDatabaseRecord } from "./FilesDatabaseRecord";
import { DmOptions } from "../../options";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { Atom, atom, PrimitiveAtom } from "jotai";
import { JotaiStore } from "../JotaiStore";
import { SerializedFileJson } from "./SerializedFileJson";
import { FileStorage, migrateFromTo } from "./FileStorage";
import { LocalStorageFileStorage } from "./LocalStorageFileStorage";
import { OpfsFileStorage } from "./OpfsFileStorage";

/**
 * Provides abstracted access to files stored in local storage
 * (in the web browser)
 */
export class FilesDatabase {
  private readonly dmOptions: DmOptions;
  private readonly jotaiStore: JotaiStore;

  /**
   * The file storage used to persist app files
   * (either OPFS or localStorage depending on the support)
   */
  private readonly fileStorage: FileStorage;

  constructor(dmOptions: DmOptions, jotaiStore: JotaiStore) {
    this.dmOptions = dmOptions;
    this.jotaiStore = jotaiStore;

    // set up file storage
    const opfsStorage = new OpfsFileStorage(
      this.dmOptions.localStoragePrefix, // to determine folder name
    );
    const localStorage = new LocalStorageFileStorage(
      this.dmOptions.localStoragePrefix,
    );
    if (opfsStorage.isSupported()) {
      // fire async data migration if needed
      (async () => {
        if (await opfsStorage.isUninitialized()) {
          console.log(
            "[FilesDatabase]: Migrating from localStorage to OPFS...",
          );
          await migrateFromTo(localStorage, opfsStorage);
          this._onIndexChanged.dispatch(await opfsStorage.loadFilesIndex());
          console.log("[FilesDatabase]: Migration done.");
        }
      })();
      this.fileStorage = opfsStorage;
    } else {
      console.log(
        "[FilesDatabase]: OPFS is not supported, falling back on localStorage.",
      );
      this.fileStorage = localStorage;
    }

    // set up Jotai stuff
    this.fileListBaseAtom = atom([]);
    this.connectIndexLogicWithJotaiAbstraction();
  }

  ///////////////////////
  // Jotai Abstraction //
  ///////////////////////

  /**
   * Exposes the list of stored files,
   * allows React to render UI based off of this list
   */
  public readonly fileListAtom: Atom<FilesDatabaseRecord[]> = atom((get) =>
    get(this.fileListBaseAtom),
  );

  private readonly fileListBaseAtom: PrimitiveAtom<FilesDatabaseRecord[]>;

  /**
   * Makes the jotai atom reflect changes in the files list
   */
  private connectIndexLogicWithJotaiAbstraction() {
    this.onIndexChanged.subscribe((records: FilesDatabaseRecord[]) => {
      this.jotaiStore.set(this.fileListBaseAtom, records);
    });

    // populate the atom with actual data (asynchronously)
    (async () => {
      this.jotaiStore.set(this.fileListBaseAtom, await this.loadFilesIndex());
    })();
  }

  /////////////////////////
  // Imperative File API //
  /////////////////////////

  /**
   * Loads a file by UUID, returns null if the file does not exist
   */
  public async loadFile(uuid: string): Promise<AppFile | null> {
    const data = await this.fileStorage.loadFile(uuid);

    if (!data) return null;

    const json = JSON.parse(data) as SerializedFileJson;

    return AppFile.fromJson(this.dmOptions, json);
  }

  /**
   * Writes the file into the local storage,
   * ovewriting any existing file with the same UUID
   */
  public async storeFile(appFile: AppFile): Promise<void> {
    // write the file data
    const data = appFile.toJsonString();
    await this.fileStorage.storeFile(appFile.uuid, data);

    // update the files index
    let list = await this.loadFilesIndex();
    list = list.filter((r) => r.uuid !== appFile.uuid);
    list.push(FilesDatabaseRecord.fromAppFile(appFile));
    await this.writeFilesIndex(list);
  }

  /**
   * Deletes a file from the local storage, given its UUID
   */
  public async deleteFile(uuid: string): Promise<void> {
    await this.fileStorage.deleteFile(uuid);

    let list = await this.loadFilesIndex();
    list = list.filter((r) => r.uuid !== uuid);
    await this.writeFilesIndex(list);
  }

  /**
   * Downloads a stored file, given its UUID
   * (triggers the browser's *download file* logic)
   */
  public async downloadFile(uuid: string): Promise<void> {
    const appFile = await this.loadFile(uuid);
    if (appFile !== null) {
      appFile.download();
    }
  }

  ////////////////////////////////
  // Internal Files Index Logic //
  ////////////////////////////////

  private _onIndexChanged = new SimpleEventDispatcher<FilesDatabaseRecord[]>();

  /**
   * Event fires whenever the files index gets modified
   * and provides the new state of the index as the argument
   */
  public get onIndexChanged(): ISimpleEvent<FilesDatabaseRecord[]> {
    return this._onIndexChanged.asEvent();
  }

  /**
   * Loads the index that lists all the stored files
   */
  private async loadFilesIndex(): Promise<FilesDatabaseRecord[]> {
    return await this.fileStorage.loadFilesIndex();
  }

  /**
   * Writes the file list index to local storage
   * @param records
   */
  private async writeFilesIndex(records: FilesDatabaseRecord[]): Promise<void> {
    await this.fileStorage.writeFilesIndex(records);

    // fire the change event, with re-loaded values to ensure proper ordering
    this._onIndexChanged.dispatch(await this.fileStorage.loadFilesIndex());
  }
}
