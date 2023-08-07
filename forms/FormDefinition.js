import { Locale } from "../locales/Locale"
import { currentOptions } from "../src/options"

formDefinitions = currentOptions.forms

export class FormDefinition {
  
  static ALL_FORM_IDS = Object.keys(formDefinitions)
  
  // which form is selected by default when a new file is created
  static DEFAULT_FORM_ID = currentOptions.defaultFormId

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
    const definition = formDefinitions[formId]
    
    if (!definition)
      throw new Error("Form ID is unknown: " + formId)

    const dataSchema = await definition.dataSchemaImporter()
    const uiSchema = await definition.uiSchemaImporter()
    const translationImporters = definition.translationImporters || {}

    return new FormDefinition(
      formId,
      dataSchema,
      uiSchema,
      translationImporters
    )
  }

  /**
   * Loads the appropriate form translations into i18n
   */
  async loadTranslation(i18n) {
    const currentLocale = i18n.language
    
    // load the current language
    await this.loadGivenTranslation(i18n, currentLocale)

    // load english as the fallback language
    await this.loadGivenTranslation(i18n, Locale.FALLBACK_LOCALE)
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
