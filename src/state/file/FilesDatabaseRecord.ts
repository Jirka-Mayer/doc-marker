import { AppFile } from "./AppFile";

/**
 * One record in the file-list index in the local storage
 */
export class FilesDatabaseRecord {
  /**
   * Universally unique ID of the file
   */
  public uuid: string;

  /**
   * When the file was created
   */
  public createdAt: Date;

  /**
   * When the file was last saved (modified)
   */
  public updatedAt: Date;

  /**
   * Human-readable name of the file to display in the listing of files,
   * should match the name stored in the file itself
   */
  public fileName: string;

  private constructor(json: any) {
    this.uuid = json.uuid || null;
    this.createdAt = new Date(json.createdAt);
    this.updatedAt = new Date(json.updatedAt);
    this.fileName = json.fileName || "";

    if (this.uuid === null)
      throw new Error("FilesDatabaseRecord must have a UUID set");
  }

  /**
   * Parses a record instance out of the serialized JSON object
   * @param json The serialized record JSON
   */
  public static fromJson(json: any): FilesDatabaseRecord {
    return new FilesDatabaseRecord(json);
  }

  /**
   * Constructs a record from an existing loaded file
   * @param appFile The loaded file
   */
  public static fromAppFile(appFile: AppFile): FilesDatabaseRecord {
    return this.fromJson({
      uuid: appFile.uuid,
      createdAt: appFile.createdAtString,
      updatedAt: appFile.updatedAtString,
      fileName: appFile.fileName,
    });
  }

  /**
   * Serializes the record to a JSON object
   */
  public toJson(): any {
    return {
      uuid: this.uuid,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      fileName: this.fileName,
    };
  }

  /**
   * Returns an always non-empty file name
   * (returns something meaningful even when the user did not provide a name)
   */
  public constructFileName(): string {
    return AppFile.constructFileName(this.fileName, this.uuid);
  }
}
