import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as moment from "moment";
import { LocalesRepository } from "../locales/LocalesRepository";
import { DmOptions } from "./options";

export async function bootstrapLocalization(
  dmOptions: DmOptions,
): Promise<LocalesRepository> {
  const localesRepository = new LocalesRepository(dmOptions);

  i18n.use(initReactI18next);

  const fallbackLocale = localesRepository.getLocale(
    localesRepository.fallbackLocaleId,
  );

  i18n.init({
    debug: false,
    fallbackLng: fallbackLocale.id,
    interpolation: {
      escapeValue: false, // not needed, as react escapes by default
    },
    resources: {
      // english is always loaded, because it's the fallback language
      [fallbackLocale.id]: await fallbackLocale.definition.importer(),
    },
  });

  // define formatters
  i18n.services.formatter!.add(
    "MOMENT_CALENDAR",
    (value, localeId, options) => {
      return moment(value)
        .locale(localesRepository.getLocale(localeId!).definition.momentLocale)
        .calendar();
    },
  );
  i18n.services.formatter!.add("FULL_TIMESTAMP", (value, localeId, options) => {
    return moment(value)
      .locale(localesRepository.getLocale(localeId!).definition.momentLocale)
      .format("ddd MMM D YYYY HH:mm:ss [GMT]Z");
  });

  // load from local storage and load the language
  localesRepository.restoreLocaleFromStorage(i18n);

  return localesRepository;
}
