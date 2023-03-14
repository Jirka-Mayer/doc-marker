export class FileStorageRecord {
  constructor(json) {
    this.uuid = json.uuid || null
    this.writtenAt = new Date(json.writtenAt)
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
      writtenAt: appFile.writteAtString,
      patientId: appFile.patientId
    })
  }

  toJson() {
    return {
      uuid: this.uuid,
      writtenAt: this.writtenAt.toISOString(),
      patientId: this.patientId
    }
  }
}