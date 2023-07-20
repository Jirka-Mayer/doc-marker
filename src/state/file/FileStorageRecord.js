import { AppFile } from "./AppFile"

export class FileStorageRecord {
  constructor(json) {
    this.uuid = json.uuid || null
    this.createdAt = new Date(json.createdAt)
    this.updatedAt = new Date(json.updatedAt)
    this.fileName = json.fileName || ""

    if (this.uuid === null)
      throw new Error("File storage record must have a UUID set")
  }
  
  static fromJson(json) {
    return new FileStorageRecord(json)
  }

  static fromAppFile(appFile) {
    return this.fromJson({
      uuid: appFile.uuid,
      createdAt: appFile.createdAtString,
      updatedAt: appFile.updatedAtString,
      fileName: appFile.fileName
    })
  }

  toJson() {
    return {
      uuid: this.uuid,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      fileName: this.fileName
    }
  }

  /**
   * Returns a non-empty file name
   */
  constructFileName() {
    return AppFile.constructFileName(this.fileName, this.uuid)
  }
}