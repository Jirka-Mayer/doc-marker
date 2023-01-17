/**
 * Represents the complete patient file, as is loaded/stored/downloaded
 */
export class PatientFile {
  static CURRENT_VERSION = 1

  constructor(body) {
    /**
     * Raw JSON body of the file
     */
    this.body = JSON.parse(JSON.stringify(body)) // clone

    this.validate()
  }

  /**
   * Creates new empty patient file belonging to a given patient ID
   * @param {string} patientId 
   * @returns {PatientFile}
   */
  static newEmpty(patientId) {
    return new PatientFile({
      
      /**
       * Version of the file so that we can perform migrations
       * and evolve the format
       */
      fileVersion: PatientFile.CURRENT_VERSION,
      
      /**
       * String patient ID used by the RES-Q registry
       */
      patientId: patientId,
      
      /**
       * Quill editor delta format representing its content
       */
      reportDelta: {
        ops: []
      },

      /**
       * When null, it means the form has not started to be filled,
       * otherwise this is an object according to the form schema
       */
      formData: null
    })
  }

  static fromApplicationState(state) {
    const {
      patientId,
      reportDelta,
      formData
    } = state

    let file = PatientFile.newEmpty(patientId)
    file.body.reportDelta = JSON.parse(JSON.stringify(reportDelta))
    file.body.formData = JSON.parse(JSON.stringify(formData))
    
    file.validate()

    return file
  }

  /**
   * Validates the file content
   */
  validate() {
    // TODO: check version and major fields
    // possibly check parts of it against some schema?
    // throw errors on problems
  }

  getPatientId() {
    return this.body.patientId
  }

  getReportDelta() {
    return this.body.reportDelta
  }

  getFormData() {
    return this.body.formData
  }

  toPrettyJson() {
    return JSON.stringify(this.body, null, 2)
  }
}