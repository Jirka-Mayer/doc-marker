import formImporters from "./index"

export class FormDefinition {
  
  static ALL_FORM_IDS = Object.keys(formImporters)
  
  // which form gets used when a new file is created
  static DEFAULT_FORM_ID = "ResQPlus Alpha 1.0"

  static I18NEXT_FORM_SPECIFIC_NS = "formSpecific" // field labels & descriptions
  static I18NEXT_FORM_GLOBAL_NS = "formGlobal" // none values, global errors

  constructor(formId, dataSchema, uiSchema, translationImporters) {
    this.id = formId
    this.dataSchema = dataSchema
    this.uiSchema = uiSchema
    this.translationImporters = translationImporters || {}
  }

  /**
   * Loads a form definition given a form ID
   * @param {string} formId
   * @returns {FormDefinition}
   */
  static async load(formId) {
    const importer = formImporters[formId]
    
    if (!importer)
      throw new Error("Form ID is unknown: " + formId)
    
    const { dataSchema, uiSchema, translationImporters } = await importer()

    return new FormDefinition(formId, dataSchema, uiSchema, translationImporters)
  }

  /**
   * Loads the appropriate form translations into i18n
   */
  async loadTranslation(i18n) {
    const currentLocale = i18n.language
    
    // load the current language
    await this.loadGivenTranslation(i18n, currentLocale)

    // load english as the fallback language
    await this.loadGivenTranslation(i18n, "en-GB")
  }

  async loadGivenTranslation(i18n, localeId) {
    if (!this.translationImporters[localeId])
      return

    const translation = await this.translationImporters[localeId]()

    i18n.addResourceBundle(
      localeId,
      FormDefinition.I18NEXT_FORM_SPECIFIC_NS,
      translation || {}
    )
  }
}
