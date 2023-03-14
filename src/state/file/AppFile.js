/**
 * Represents the file that is loaded and edited by the application
 */
export class AppFile {
  
  /**
   * Current version of the file, that the application works with
   */
  static CURRENT_VERSION = 1

  constructor(body) {
    /**
     * Raw JSON body of the file
     */
    this.body = JSON.parse(JSON.stringify(body)) // clone

    this.validate()
  }

  static generateNewUuid() {
    // TODO: use proper UUID v4 library
    return "dummy-uuid-" + Math.round(Math.random() * 10000)
  }

  static fromJson(body) {
    return new AppFile(body)
  }

  static createNewEmpty(formId) {
    return AppFile.fromJson({
      "_version": AppFile.CURRENT_VERSION,
    
      "_uuid": this.generateNewUuid(),
      "_writtenAt": new Date().toISOString(),
      
      "_formId": formId,
      "_formData": null,
      
      "_reportDelta": { ops: [] },
      "_reportText": "",
      "_highlights": {},

      "patientId": null,
    })
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

    if (json["_version"] !== CURRENT_VERSION)
      throw new Error("Invalid file version: " + json["_version"])
    
    if (!json["_uuid"])
      throw new Error("Missing file UUID")
    
    if (!json["_writtenAt"])
      throw new Error("Missing file '_writtenAt' field")

    // ... validate other fields as well ...
  }


  ////////////////////////
  // Body Field Getters //
  ////////////////////////

  get uuid() {
    return this.body["_uuid"]
  }

  get writtenAtString() {
    return this.body["_writtenAt"]
  }

  get writtenAtDate() {
    return new Date(this.body["_writtenAt"])
  }

  get patientId() {
    return this.body["patientId"]
  }
}