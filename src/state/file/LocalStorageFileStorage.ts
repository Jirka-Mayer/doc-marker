import { FilesDatabaseRecord } from "./FilesDatabaseRecord";
import {
  FileStorage,
  parseFilesIndex,
  serializeFilesIndex,
} from "./FileStorage";

const localStorage = window.localStorage;

/**
 * Implements FileStorage via web browser's localStoage API
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
 *
 * The primary downside is the 5MB quota on localStorage,
 * that's why OPFS is prefered.
 */
export class LocalStorageFileStorage implements FileStorage {
  /**
   * Prefix for keys in the localStorage
   */
  private readonly localStoragePrefix: string;

  public constructor(localStoragePrefix: string) {
    this.localStoragePrefix = localStoragePrefix;
  }

  /**
   * The key under which the list of all stored files (the index) is stored
   */
  private get FILES_INDEX_KEY(): string {
    return this.localStoragePrefix + "docMarkerFileList";
  }

  /**
   * The key prefix used for storing individual files
   */
  private get FILE_KEY_PREFIX(): string {
    return this.localStoragePrefix + "docMarkerFile/"; // + file UUID
  }

  /**
   * Loads an app file with given UUID, returns null if that UUID is not stored.
   */
  public async loadFile(uuid: string): Promise<string | null> {
    return localStorage.getItem(this.FILE_KEY_PREFIX + uuid);
  }

  /**
   * Creates or updates a file with given UUID
   */
  public async storeFile(uuid: string, data: string): Promise<void> {
    localStorage.setItem(this.FILE_KEY_PREFIX + uuid, data);
  }

  /**
   * Checks whether a file with the given UUID exists in the storage
   */
  public async hasFile(uuid: string): Promise<boolean> {
    return (await this.loadFile(uuid)) !== null;
  }

  /**
   * Deletes a file with given UUID, does nothing if that UUID is not stored
   */
  public async deleteFile(uuid: string): Promise<void> {
    localStorage.removeItem(this.FILE_KEY_PREFIX + uuid);
  }

  /**
   * Loads the index containing all stored files
   */
  public async loadFilesIndex(): Promise<FilesDatabaseRecord[]> {
    const data = localStorage.getItem(this.FILES_INDEX_KEY);
    return await parseFilesIndex(data, this);
  }

  /**
   * Writes the index containing all stored files
   */
  public async writeFilesIndex(records: FilesDatabaseRecord[]): Promise<void> {
    const data = serializeFilesIndex(records);
    localStorage.setItem(this.FILES_INDEX_KEY, data);
  }
}
