import { i18n } from "i18next"
import { LocaleDefinition } from "./LocaleDefinition";

/**
 * Represents a locale for the application
 */
export class Locale {
  
  /**
   * ID of this locale
   */
  public readonly id: string;

  /**
   * The definition of this locale
   */
  public readonly definition: LocaleDefinition;

  /**
   * ID of the fallback locale
   */
  private readonly fallbackLocaleId: string;

  public constructor(
    localeId: string,
    definition: LocaleDefinition,
    fallbackLocaleId: string,
  ) {
    this.id = localeId;
    this.definition = definition;
    this.fallbackLocaleId = fallbackLocaleId;
  }

  /**
   * Load and set this locale on a given i18next instance
   */
  async applyTo(i18n: i18n) {
    // load language resources only if it's not the fallback language
    // (the fallback language is loaded always during startup and re-loading
    // it causes errors in the console)
    if (this.id !== this.fallbackLocaleId) {
      // load language resources
      const namespaces = await this.definition.importer();
  
      // add all namespaces
      for (let ns in namespaces) {
        i18n.addResourceBundle(this.id, ns, namespaces[ns]);
      }
    }

    // change the language to trigger re-render
    i18n.changeLanguage(this.id);
  }
}
