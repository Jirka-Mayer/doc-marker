import { AppFile } from "./AppFile"

export class FileStorageRecord {
  constructor(json) {
    this.uuid = json.uuid || null
    this.createdAt = new Date(json.createdAt)
    this.updatedAt = new Date(json.updatedAt)
    this.patientId = json.patientId || null

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
      patientId: appFile.patientId
    })
  }

  toJson() {
    return {
      uuid: this.uuid,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      patientId: this.patientId
    }
  }

  /**
   * Returns the desired file name as string
   */
  constructFileName() {
    return AppFile.constructFileName(this.patientId, this.uuid)
  }
}