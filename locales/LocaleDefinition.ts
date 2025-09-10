/**
 * The structure of a locale record in the DocMarker options object
 */
export interface LocaleDefinition {
  /**
   * Human readable title for the locale (in the locale's language),
   * e.g. "Česky" or "English (UK)" or "Deutsch"
   */
  readonly title: string;

  /**
   * Async function that loads the locale's i18n namespaces
   */
  readonly importer: () => Promise<any>;

  /**
   * What locale to set for the Moment.js library
   */
  readonly momentLocale: string;
}

/**
 * Dictionary of locale definitions, where the key is the locale ID
 * (e.g. "cs", "en-US")
 */
export interface LocaleDefinitions {
  [localeId: string]: LocaleDefinition;
}
