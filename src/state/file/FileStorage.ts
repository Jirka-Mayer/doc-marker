import { FilesDatabaseRecord } from "./FilesDatabaseRecord";

/**
 * An abstraction over the storage used to store DocMarker app files,
 * implemented either via localStorage or via OPFS file system
 */
export interface FileStorage {
  /**
   * Loads an app file with given UUID, returns null if that UUID is not stored.
   */
  loadFile(uuid: string): Promise<string | null>;

  /**
   * Creates or updates a file with given UUID
   */
  storeFile(uuid: string, data: string): Promise<void>;

  /**
   * Checks whether a file with the given UUID exists in the storage
   */
  hasFile(uuid: string): Promise<boolean>;

  /**
   * Deletes a file with given UUID, does nothing if that UUID is not stored
   */
  deleteFile(uuid: string): Promise<void>;

  /**
   * Loads the index containing all stored files
   */
  loadFilesIndex(): Promise<FilesDatabaseRecord[]>;

  /**
   * Writes the index containing all stored files
   */
  writeFilesIndex(records: FilesDatabaseRecord[]): Promise<void>;
}

/**
 * Centralizes the logic that parses the files index content for all possible
 * file storage implementations.
 *
 * @param data The raw data of the index (a JSON string),
 *  null means the index does not exist yet in the storage.
 * @param storage Handle on the file storage so that files may be
 *  checked for existence.
 */
export async function parseFilesIndex(
  data: string | null,
  storage: FileStorage,
): Promise<FilesDatabaseRecord[]> {
  if (!data) {
    // there is no file list, the app was launched for the first time
    return [];
  }

  const json = JSON.parse(data) as any[];

  if (!Array.isArray(json)) {
    console.error("Failed to list stored files, file list not an array:", json);
    return [];
  }

  let records = json.map((j) => FilesDatabaseRecord.fromJson(j));

  records.sort((a, b) => a.updatedAt.valueOf() - b.updatedAt.valueOf());
  records.reverse(); // newest to oldest

  // throw away files that do not have a corresponding record in the storage
  let filteredRecords: FilesDatabaseRecord[] = [];
  for (const record of records) {
    if (await storage.hasFile(record.uuid)) {
      filteredRecords.push(record);
    }
  }

  return filteredRecords;
}

/**
 * Centralizes the logic that serializes the files index into JSON string
 * for all possible file storage implementations.
 */
export function serializeFilesIndex(records: FilesDatabaseRecord[]): string {
  const json: any[] = records.map((r) => r.toJson());
  return JSON.stringify(json);
}

/**
 * Migrates data from one FileStorage to another one.
 * Assumes the target storage is completely empty.
 * Leaves the source storage as-is (does not delete any files).
 */
export async function migrateFromTo(
  from: FileStorage,
  to: FileStorage,
): Promise<void> {
  // transfer index
  const records = await from.loadFilesIndex();
  to.writeFilesIndex(records);

  // transfer files
  for (const record of records) {
    const data = await from.loadFile(record.uuid);
    if (data !== null) {
      await to.storeFile(record.uuid, data);
    }
  }
}
