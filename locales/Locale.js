import localeDefinitions from "./index"

const STORAGE_KEY = "docMarkerCurrentLocale"

function objectMap(object, mapFn) {
  return Object.keys(object).reduce(function(result, key) {
    result[key] = mapFn(key, object[key])
    return result
  }, {})
}

export class Locale {
  
  static ALL_LOCALE_IDS = Object.keys(localeDefinitions)

  static ALL_LOCALES = objectMap(localeDefinitions,
    (id, definition) => new Locale(id, definition)
  )

  static FALLBACK_LOCALE = "en-GB"

  constructor(id, definition) {
    this.id = id
    this.title = definition.title
    this.importer = definition.importer
    this.momentLocale = definition.momentLocale
  }

  /**
   * Resolves a locale instance by its ID
   * @returns {Locale}
   */
  static get(id) {
    return this.ALL_LOCALES[id]
  }

  /**
   * Load and set this locale on a given i18next instance
   */
  async applyTo(i18n) {
    // load language resources only if it's not the fallback language
    // (the fallback language is loaded always during startup and re-loading
    // it causes errors in the console)
    if (this.id !== Locale.FALLBACK_LOCALE) {
      // load language resources
      const namespaces = await this.importer()
  
      // add all namespaces
      for (let ns in namespaces) {
        i18n.addResourceBundle(this.id, ns, namespaces[ns])
      }
    }

    // change the language to trigger re-render
    i18n.changeLanguage(this.id)
  }

  /**
   * Stores the current language in local storage
   */
  persist() {
    localStorage[STORAGE_KEY] = this.id
  }

  /**
   * Loads the current language from local storage
   * or refreshes the current language
   */
  static restore(i18n) {
    const id = localStorage[STORAGE_KEY]
    
    if (id) {
      Locale.get(id).applyTo(i18n)
    } else {
      Locale.get(i18n.language).applyTo(i18n)
    }
  }
}
