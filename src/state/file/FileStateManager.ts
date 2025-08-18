import {
  ISignal,
  ISimpleEvent,
  SignalDispatcher,
  SimpleEventDispatcher,
} from "strongly-typed-events";
import { AppFile, historyStore } from "..";
import { FileMetadataStore } from "./FileMetadataStore";
import { FilesDatabase } from "./FilesDatabase";
import { FileSerializer } from "./FileSerializer";

/**
 * Service that provides top-level control over the file-related state
 * of the application (the currently openned file). Handles opening and
 * closing of files.
 */
export class FileStateManager {
  private readonly filesDatabase: FilesDatabase;
  private readonly serializer: FileSerializer;
  private readonly fileMeta: FileMetadataStore;

  constructor(
    filesDatabase: FilesDatabase,
    serializer: FileSerializer,
    fileMeta: FileMetadataStore,
  ) {
    this.filesDatabase = filesDatabase;
    this.serializer = serializer;
    this.fileMeta = fileMeta;
  }

  /**
   * Creates a new file and opens it.
   * If a file is already open, it will save and close
   * that file and only then open the new file.
   * @param formId ID of the JSON form to use for the new file.
   */
  public createNewFile(formId: string): void {
    this.closeFile();
    this.serializer.deserializeFromFile(AppFile.createNewEmpty(formId));
    historyStore.clear();
  }

  /**
   * Closes the currently open file.
   * (which may trigger save via event handler in the autosave store)
   */
  public closeFile(): void {
    // fire the event
    this._onBeforeFileClose.dispatch();

    // this actually closes the file
    this.fileMeta.fileUuid = null;
  }

  /**
   * Saves the currently open file to local storage
   * (or does nothing if no file is open)
   */
  public saveCurrentFile(): void {
    const appFile = this.serializer.serializeToFile();

    if (appFile === null) {
      // no file is open
      return;
    }

    this.filesDatabase.storeFile(appFile);

    // fire the event
    this._onFileSaved.dispatch(appFile);
  }

  /**
   * Opens a file from the local storage based on the given UUID
   */
  public openFile(uuid: string): void {
    const appFile = this.filesDatabase.loadFile(uuid);
    if (appFile === null) return;
    this.serializer.deserializeFromFile(appFile);
    historyStore.clear();
  }

  /**
   * Downloads the currently open file
   * (triggers the browser's download file logic)
   */
  public downloadCurrentFile(): void {
    const appFile = this.serializer.serializeToFile();

    if (appFile === null) {
      throw new Error("Cannot download current file, no file is open.");
    }

    appFile.download();
  }

  ////////////
  // Events //
  ////////////

  private _onBeforeFileClose = new SignalDispatcher();

  /**
   * Fires before a file is closed, used to trigger autosave
   */
  public get onBeforeFileClose(): ISignal {
    return this._onBeforeFileClose.asEvent();
  }

  private _onFileSaved = new SimpleEventDispatcher<AppFile>();

  /**
   * Fires right after the current file is saved to local storage.
   * This may be autosave-triggered, it does NOT mean the file is being closed.
   */
  public get onFileSaved(): ISimpleEvent<AppFile> {
    return this._onFileSaved.asEvent();
  }
}
