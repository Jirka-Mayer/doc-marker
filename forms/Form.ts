import { i18n } from "i18next";
import { FormTranslationImporters } from "./FormDefinition";

/**
 * Represents a form for the application
 */
export class Form {
  /**
   * i18n namespace for form-specific data, i.e. field labels and descriptions
   */
  public static readonly I18NEXT_FORM_SPECIFIC_NS = "formSpecific";

  /**
   * i18n namespace for form-global data, i.e. none values, global errors
   */
  public static readonly I18NEXT_FORM_GLOBAL_NS = "formGlobal";

  /**
   * ID of this form
   */
  public readonly id: string;

  /**
   * The JSON schema object for the form data
   */
  public readonly dataSchema: any;

  /**
   * The JsonForms UI schema object for the form
   */
  public readonly uiSchema: any;

  /**
   * Importers for i18n translation namespaces
   */
  public readonly translationImporters: FormTranslationImporters;

  constructor(
    formId: string,
    dataSchema: any,
    uiSchema: any,
    translationImporters: FormTranslationImporters,
  ) {
    this.id = formId;
    this.dataSchema = dataSchema;
    this.uiSchema = uiSchema;
    this.translationImporters = translationImporters;
  }

  /**
   * Loads the appropriate form translations into i18n
   */
  public async loadTranslation(
    i18n: i18n,
    fallbackLocaleId: string,
  ): Promise<void> {
    const currentLocale = i18n.language;

    // load the current language
    await this.loadGivenTranslation(i18n, currentLocale);

    // load english as the fallback language
    await this.loadGivenTranslation(i18n, fallbackLocaleId);
  }

  private async loadGivenTranslation(i18n, localeId): Promise<void> {
    if (!this.translationImporters[localeId]) return;

    const translation = await this.translationImporters[localeId]();

    i18n.addResourceBundle(
      localeId,
      Form.I18NEXT_FORM_SPECIFIC_NS,
      translation || {},
    );
  }
}
