import { AppFile } from "./AppFile";
import { FilesDatabaseRecord } from "./FilesDatabaseRecord";
import { DmOptions } from "../../options";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { Atom, atom, PrimitiveAtom } from "jotai";
import { JotaiStore } from "../JotaiStore";
import { SerializedFileJson } from "./SerializedFileJson";

const localStorage = window.localStorage;

/**
 * Provides abstracted access to files stored in local storage
 * (in the web browser)
 */
export class FilesDatabase {
  private readonly dmOptions: DmOptions;
  private readonly jotaiStore: JotaiStore;

  constructor(dmOptions: DmOptions, jotaiStore: JotaiStore) {
    this.dmOptions = dmOptions;
    this.jotaiStore = jotaiStore;

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

  private readonly fileListBaseAtom: PrimitiveAtom<FilesDatabaseRecord[]> =
    atom(this.loadFilesIndex());

  /**
   * Makes the jotai atom reflect changes in the files list
   */
  private connectIndexLogicWithJotaiAbstraction() {
    this.onIndexChanged.subscribe((records: FilesDatabaseRecord[]) => {
      this.jotaiStore.set(this.fileListBaseAtom, records);
    });
  }

  /////////////////////////
  // Imperative File API //
  /////////////////////////

  /**
   * Loads a file by UUID, returns null if the file does not exist
   */
  public loadFile(uuid: string): AppFile | null {
    const data = localStorage.getItem(this.FILE_KEY_PREFIX + uuid);

    if (!data) return null;

    const json = JSON.parse(data) as SerializedFileJson;

    return AppFile.fromJson(this.dmOptions, json);
  }

  /**
   * Writes the file into the local storage,
   * ovewriting any existing file with the same UUID
   */
  public storeFile(appFile: AppFile): void {
    // write the file data
    const data = appFile.toJsonString();
    localStorage.setItem(this.FILE_KEY_PREFIX + appFile.uuid, data);

    // update the files index
    let list = this.loadFilesIndex();
    list = list.filter((r) => r.uuid !== appFile.uuid);
    list.push(FilesDatabaseRecord.fromAppFile(appFile));
    this.writeFilesIndex(list);
  }

  /**
   * Deletes a file from the local storage, given its UUID
   */
  public deleteFile(uuid: string): void {
    localStorage.removeItem(this.FILE_KEY_PREFIX + uuid);

    let list = this.loadFilesIndex();
    list = list.filter((r) => r.uuid !== uuid);
    this.writeFilesIndex(list);
  }

  /**
   * Downloads a stored file, given its UUID
   * (triggers the browser's *download file* logic)
   */
  public downloadFile(uuid: string): void {
    const appFile = this.loadFile(uuid);
    if (appFile !== null) {
      appFile.download();
    }
  }

  ////////////////////////////////
  // Internal Files Index Logic //
  ////////////////////////////////

  /**
   * The key under which the list of all stored files (the index) is stored
   */
  public get FILES_INDEX_KEY(): string {
    return this.dmOptions.localStoragePrefix + "docMarkerFileList";
  }

  /**
   * The key prefix used for storing individual files
   */
  public get FILE_KEY_PREFIX(): string {
    return this.dmOptions.localStoragePrefix + "docMarkerFile/"; // + file UUID
  }

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
  private loadFilesIndex(): FilesDatabaseRecord[] {
    const data = localStorage.getItem(this.FILES_INDEX_KEY);

    if (!data) {
      // there is no file list, the app was launched for the first time
      return [];
    }

    const json = JSON.parse(data) as any[];

    if (!Array.isArray(json)) {
      console.error(
        "Failed to list stored files, file list not an array:",
        json,
      );
      return [];
    }

    let records = json.map((j) => FilesDatabaseRecord.fromJson(j));

    records.sort((a, b) => a.updatedAt.valueOf() - b.updatedAt.valueOf());
    records.reverse(); // newest to oldest

    // throw away files that do not have a corresponding record in the storage
    records = records.filter((r) =>
      localStorage.getItem(this.FILE_KEY_PREFIX + r.uuid),
    );

    return records;
  }

  /**
   * Writes the file list index to local storage
   * @param records
   */
  private writeFilesIndex(records: FilesDatabaseRecord[]): void {
    const json: object[] = records.map((r) => r.toJson());
    localStorage.setItem(this.FILES_INDEX_KEY, JSON.stringify(json));

    // fire the change event, with re-loaded values to ensure proper ordering
    this._onIndexChanged.dispatch(this.loadFilesIndex());
  }
}
