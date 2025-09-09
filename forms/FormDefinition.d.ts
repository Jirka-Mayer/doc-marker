/**
 * The structure of a form record in the DocMarker options object
 */
export interface FormDefinition {
  /**
   * Async function that returns the JsonSchema JSON object for the form data
   */
  dataSchemaImporter: () => Promise<any>;

  /**
   * Async function that returns the UiSchema JSON object for the JsonForms form
   */
  uiSchemaImporter: () => Promise<any>;

  /**
   * Importers for translation dictionaries for various locales.
   * The key is the locale ID and the value is the async importer function.
   */
  translationImporters: FormTranslationImporters;
}

/**
 * Dictionary of form definitions, where the key is the form ID
 */
export interface FormDefinitions {
  [formId: string]: FormDefinition;
}

/**
 * Importers for translation dictionaries for various locales.
 * The key is the locale ID and the value is the async importer function.
 */
export interface FormTranslationImporters {
  [localeId: string]: FormTranslationImporter;
}

/**
 * Async function that return the i18n JSON object for the namespace
 * that translates form fields and error messages.
 */
export type FormTranslationImporter = () => Promise<any>;
