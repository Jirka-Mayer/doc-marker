import formImporters from "./index"

export class FormDefinition {
  
  static ALL_FORM_IDS = Object.keys(formImporters)
  
  static DEFAULT_FORM_ID = "ResQPlus AppDevelopmentForm 1.0 CZ"

  constructor(formId, dataSchema, uiSchema) {
    this.id = formId
    this.dataSchema = dataSchema
    this.uiSchema = uiSchema
  }

  static async load(formId) {
    const importer = formImporters[formId]
    
    if (!importer)
      throw new Error("Form ID is unknown: " + formId)
    
    const { dataSchema, uiSchema } = await importer()

    return new FormDefinition(formId, dataSchema, uiSchema)
  }
}
