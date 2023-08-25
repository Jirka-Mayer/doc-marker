import { currentOptions } from "../../options"
import * as uuid from "uuid"
import * as packageJson from "../../../package.json"
import { AppMode } from "../editor/AppMode"

const DOC_MARKER_VERSION = packageJson.version

/**
 * Represents the file that is loaded and edited by the application
 */
export class AppFile {

  constructor(body) {
    /**
     * Raw JSON body of the file
     */
    this.body = JSON.parse(JSON.stringify(body)) // clone

    this.validate()
  }

  static generateNewUuid() {
    return uuid.v4()
  }

  static fromJson(body) {
    return new AppFile(body)
  }

  static createNewEmpty(formId) {
    const now = new Date()
    
    let fileJson = {
      "_version": currentOptions.file.currentVersion,
      "_docMarkerVersion": DOC_MARKER_VERSION,
      "_docMarkerCustomizationVersion": currentOptions.customization.version,
      "_docMarkerCustomizationName": currentOptions.customization.name,
    
      "_uuid": this.generateNewUuid(),
      "_fileName": "",
      "_createdAt": now.toISOString(),
      "_updatedAt": now.toISOString(),

      "_appMode": AppMode.EDIT_TEXT,
      
      "_formId": formId,
      "_formData": null,
      
      "_reportDelta": { ops: [] },
      "_reportText": "",
      "_highlights": {},
    }

    fileJson = currentOptions.file.onCreateEmpty(fileJson)

    return AppFile.fromJson(fileJson)
  }

  toJson() {
    return JSON.parse(JSON.stringify(this.body)) // clone body
  }

  toJsonString() {
    return JSON.stringify(this.body)
  }

  toPrettyJsonString() {
    return JSON.stringify(this.body, null, 2)
  }

  validate() {
    const json = this.body

    if (json["_version"] !== currentOptions.file.currentVersion)
      throw new Error("Invalid file version: " + json["_version"])
    
    if (!json["_uuid"])
      throw new Error("Missing file UUID")
    
      if (!json["_createdAt"])
      throw new Error("Missing file '_createdAt' field")

    if (!json["_updatedAt"])
      throw new Error("Missing file '_updatedAt' field")

    // ... validate other fields as well ...
  }


  ////////////////////////
  // Body Field Getters //
  ////////////////////////

  get uuid() {
    return this.body["_uuid"]
  }

  get createdAtString() {
    return this.body["_createdAt"]
  }

  get createdAtDate() {
    return new Date(this.body["_createdAt"])
  }

  get updatedAtString() {
    return this.body["_updatedAt"]
  }

  get updatedAtDate() {
    return new Date(this.body["_updatedAt"])
  }

  get fileName() {
    return this.body["_fileName"]
  }


  ///////////
  // Other //
  ///////////

  /**
   * Returns file name that is never empty
   */
  static constructFileName(fileName, uuid) {
    if (fileName) {
      return fileName
    }
    if (uuid) {
      return AppFile.constructUuidFileName(uuid)
    }
    return null
  }

  /**
   * Returns the default file name is only the UUID is known
   * (user has not specified any other file name)
   */
  static constructUuidFileName(uuid) {
    return "file-" + uuid.substring(0, 8)
  }

  /**
   * Returns file name that is never empty
   */
  constructFileName() {
    return AppFile.constructFileName(this.fileName, this.uuid)
  }

  /**
   * Download this app file to the user's computer
   */
  download() {
    // export JSON
    const jsonString = this.toPrettyJsonString()

    // download file
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString)
    let a = document.createElement("a")
    a.setAttribute("href", dataStr)
    a.setAttribute("download", this.constructFileName() + ".json")
    a.click()
  }
}