import i18n from "i18next"
import { initReactI18next } from 'react-i18next'
import { Locale } from "../locales/Locale"
import * as en_gb from "../locales/en-GB"
import moment from "moment"

i18n.use(initReactI18next)

i18n.init({
  debug: false,
  fallbackLng: Locale.FALLBACK_LOCALE,
  interpolation: {
    escapeValue: false // not needed, as react escapes by default
  },
  resources: {
    // english is always loaded, because it's the fallback language
    [Locale.FALLBACK_LOCALE]: en_gb
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

export default i18n
