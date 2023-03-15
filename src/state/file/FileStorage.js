import { AppFile } from "./AppFile"
import { FileStorageRecord } from "./FileStorageRecord"

const localStorage = window.localStorage

/**
 * Abstracts away the local storage that stores the files in the browser
 */
export class FileStorage {

  static FILE_LIST_KEY = "docMarkerFileList"
  static FILE_KEY_PREFIX = "docMarkerFile/" // + file UUID

  /**
   * Returns the list of stored files
   */
  static listFiles() {
    const data = localStorage.getItem(this.FILE_LIST_KEY)
    
    if (!data)
      return []
    
    const json = JSON.parse(data)

    let out = []
    for (let i = 0; i < json.length; i++) {
      out.push(FileStorageRecord.fromJson(json[i]))
    }

    out.sort((a, b) => a.updatedAt - b.updatedAt)
    out.reverse() // newest to oldest

    out = out.filter(
      r => localStorage.getItem(this.FILE_KEY_PREFIX + r.uuid)
    )

    return out
  }

  static _writeFileList(list) {
    const json = []
    for (let i = 0; i < list.length; i++) {
      json.push(list[i].toJson())
    }
    localStorage.setItem(this.FILE_LIST_KEY, JSON.stringify(json))
  }

  /**
   * Update or create an app file
   */
  static storeFile(appFile) {
    const text = appFile.toJsonString()
    localStorage.setItem(this.FILE_KEY_PREFIX + appFile.uuid, text)

    let list = this.listFiles()
    list = list.filter(r => r.uuid !== appFile.uuid)
    list.push(FileStorageRecord.fromAppFile(appFile))
    this._writeFileList(list)
  }

  /**
   * Loads a file by UUID, returns null if the file does not exist
   */
  static loadFile(uuid) {
    const data = localStorage.getItem(this.FILE_KEY_PREFIX + uuid)
    
    if (!data)
      return null

    const json = JSON.parse(data)

    return AppFile.fromJson(json)
  }

  /**
   * Deletes a file from the storage
   */
  static deleteFile(uuid) {
    localStorage.removeItem(this.FILE_KEY_PREFIX + uuid)

    let list = this.listFiles()
    list = list.filter(r => r.uuid !== uuid)
    this._writeFileList(list)
  }

}
