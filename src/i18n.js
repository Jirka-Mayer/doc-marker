import i18n from "i18next"
import { initReactI18next } from 'react-i18next'
import moment from "moment"

export async function bootstrapLocalization() {
  // defered import so that options are already set when the file is imported
  const { Locale } = await import("../locales/Locale")

  i18n.use(initReactI18next)

  const fallbackLocale = Locale.get(Locale.FALLBACK_LOCALE)
  
  i18n.init({
    debug: false,
    fallbackLng: fallbackLocale.id,
    interpolation: {
      escapeValue: false // not needed, as react escapes by default
    },
    resources: {
      // english is always loaded, because it's the fallback language
      [fallbackLocale.id]: await fallbackLocale.importer()
    }
  })

  // define formatters
  i18n.services.formatter.add("MOMENT_CALENDAR", (value, localeId, options) => {
    return moment(value).locale(Locale.get(localeId).momentLocale).calendar()
  })
  i18n.services.formatter.add("FULL_TIMESTAMP", (value, localeId, options) => {
    return moment(value).locale(Locale.get(localeId).momentLocale).format(
      "ddd MMM D YYYY HH:mm:ss [GMT]Z"
    )
  })

  // load from local storage and load the language
  Locale.restore(i18n)
}