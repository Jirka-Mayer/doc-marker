import { i18n } from "i18next";
import { DmOptions } from "../src/options";
import { Locale } from "./Locale";

/**
 * Global service that loads locales and persists the current
 * locale in local storage
 */
export class LocalesRepository {
  /**
   * The locale that should be used for translation, when the current
   * locale lacks the given translation key.
   */
  public readonly fallbackLocaleId: string;

  /**
   * IDs of all available locales
   */
  public readonly allLocaleIds: string[];

  /**
   * Instances of all locales
   */
  private readonly allLocales: ReadonlyMap<string, Locale>;

  /**
   * Key where the current locale ID is stored in local storage
   */
  private readonly localStorageKey: string;

  public constructor(dmOptions: DmOptions) {
    this.allLocaleIds = Object.keys(dmOptions.locales);
    this.fallbackLocaleId = dmOptions.fallbackLocale;

    const allLocales = new Map<string, Locale>();
    for (const localeId of this.allLocaleIds) {
      allLocales.set(
        localeId,
        new Locale(
          localeId,
          dmOptions.locales[localeId],
          dmOptions.fallbackLocale,
        ),
      );
    }
    this.allLocales = allLocales;

    this.localStorageKey =
      dmOptions.localStoragePrefix + "docMarkerCurrentLocale";
  }

  /**
   * Returns the locale wrapper object for a given locale ID
   */
  public getLocale(localeId: string): Locale {
    const locale = this.allLocales.get(localeId);
    if (locale === undefined) {
      throw new Error(`Locale ${localeId} is not defined in options.`);
    }
    return locale;
  }

  /**
   * Writes the current locale ID to local storage
   */
  public persistCurrentLocaleId(i18n: i18n): void {
    localStorage[this.localStorageKey] = i18n.language;
  }

  /**
   * Restores the locale from the ID stored in local storage
   * (or reload the currently set locale if nothing in the storage)
   */
  public restoreLocaleFromStorage(i18n: i18n): void {
    const id = localStorage[this.localStorageKey];

    if (id) {
      this.getLocale(id).applyTo(i18n);
    } else {
      this.getLocale(i18n.language).applyTo(i18n);
    }
  }
}
