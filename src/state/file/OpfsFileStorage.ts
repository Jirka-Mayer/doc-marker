import { FilesDatabaseRecord } from "./FilesDatabaseRecord";
import {
  FileStorage,
  parseFilesIndex,
  serializeFilesIndex,
} from "./FileStorage";

/**
 * Implements FileStorage via web browser's OPFS API
 * https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
 *
 * OPFS is preferred, because of its high quota. Local storage
 * on the other hand has quota of only 5MB.
 */
export class OpfsFileStorage implements FileStorage {
  private readonly directoryName: string;

  /**
   * @param localStoragePrefix Used to compute the name of the directory used
   *  withing the OPFS root directory. Only alphanumeric characters are used
   *  from the given string. The given argument should be the localStorage
   *  key prefix for backwards compatibility reasons.
   */
  constructor(localStoragePrefix: string) {
    let prefixWithOnlyAlphanums = [...localStoragePrefix]
      .filter((c) => /[A-Za-z0-9]/.test(c))
      .join("");

    this.directoryName = "DocMarker-" + prefixWithOnlyAlphanums;
  }

  /**
   * Determines whether OPFS is supported
   */
  public isSupported(): boolean {
    return !!navigator.storage && !!navigator.storage.getDirectory;
  }

  /**
   * True if the OPFS storage is not initialized
   * (i.e. the app was launched for the first time
   * on this machine)
   */
  public async isUninitialized(): Promise<boolean> {
    // checks whether the directory exists or not
    const opfsRoot = await navigator.storage.getDirectory();
    try {
      await opfsRoot.getDirectoryHandle(this.directoryName, { create: false });
    } catch (e) {
      if (e instanceof DOMException && e.name == "NotFoundError") {
        return true;
      }
      throw e;
    }
    return false;
  }

  /**
   * Loads an app file with given UUID, returns null if that UUID is not stored.
   */
  public async loadFile(uuid: string): Promise<string | null> {
    const opfsRoot = await navigator.storage.getDirectory();
    const directory = await opfsRoot.getDirectoryHandle(this.directoryName, {
      create: true,
    });
    try {
      const file = await directory.getFileHandle(uuid + ".json", {
        create: false,
      });
      return await (await file.getFile()).text();
    } catch (e) {
      if (e instanceof DOMException && e.name == "NotFoundError") {
        return null;
      }
      throw e;
    }
  }

  /**
   * Creates or updates a file with given UUID
   */
  public async storeFile(uuid: string, data: string): Promise<void> {
    const opfsRoot = await navigator.storage.getDirectory();
    const directory = await opfsRoot.getDirectoryHandle(this.directoryName, {
      create: true,
    });
    const file = await directory.getFileHandle(uuid + ".json", {
      create: true,
    });
    const stream = await file.createWritable();
    await stream.write(data);
    await stream.close();
  }

  /**
   * Checks whether a file with the given UUID exists in the storage
   */
  public async hasFile(uuid: string): Promise<boolean> {
    const opfsRoot = await navigator.storage.getDirectory();
    const directory = await opfsRoot.getDirectoryHandle(this.directoryName, {
      create: true,
    });
    try {
      await directory.getFileHandle(uuid + ".json", {
        create: false,
      });
      return true;
    } catch (e) {
      if (e instanceof DOMException && e.name == "NotFoundError") {
        return false;
      }
      throw e;
    }
  }

  /**
   * Deletes a file with given UUID, does nothing if that UUID is not stored
   */
  public async deleteFile(uuid: string): Promise<void> {
    const opfsRoot = await navigator.storage.getDirectory();
    const directory = await opfsRoot.getDirectoryHandle(this.directoryName, {
      create: true,
    });
    try {
      await directory.removeEntry(uuid + ".json");
    } catch (e) {
      if (e instanceof DOMException && e.name == "NotFoundError") {
        return; // it is OK if the file does not exist
      }
      throw e;
    }
  }

  /**
   * Loads the index containing all stored files
   */
  public async loadFilesIndex(): Promise<FilesDatabaseRecord[]> {
    const opfsRoot = await navigator.storage.getDirectory();
    const directory = await opfsRoot.getDirectoryHandle(this.directoryName, {
      create: true,
    });
    try {
      const file = await directory.getFileHandle("INDEX.json", {
        create: false,
      });
      const data = await (await file.getFile()).text();
      return await parseFilesIndex(data, this);
    } catch (e) {
      if (e instanceof DOMException && e.name == "NotFoundError") {
        return [];
      }
      throw e;
    }
  }

  /**
   * Writes the index containing all stored files
   */
  public async writeFilesIndex(records: FilesDatabaseRecord[]): Promise<void> {
    const data = serializeFilesIndex(records);

    const opfsRoot = await navigator.storage.getDirectory();
    const directory = await opfsRoot.getDirectoryHandle(this.directoryName, {
      create: true,
    });
    const file = await directory.getFileHandle("INDEX.json", {
      create: true,
    });
    const stream = await file.createWritable();
    await stream.write(data);
    await stream.close();
  }
}
