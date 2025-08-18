/**
 * ISO 369 Language codes
 * Only a popular subset, can be extended with a PR.
 * Taken from wikipedia: https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
 */
export enum IsoLanguage {
  ab = "ab", // Abkhazian
  sq = "sq", // Albanian
  ar = "ar", // Arabic
  hy = "hy", // Armenian
  az = "az", // Azerbaijani
  be = "be", // Belarusian
  bn = "bn", // Bengali
  bs = "bs", // Bosnian
  bg = "bg", // Bulgarian
  my = "my", // Burmese
  ca = "ca", // Catalan
  zh = "zh", // Chinese
  hr = "hr", // Croatian
  cs = "cs", // Czech
  da = "da", // Danish
  nl = "nl", // Dutch
  en = "en", // English
  et = "et", // Estonian
  fi = "fi", // Finnish
  fr = "fr", // French
  gd = "gd", // Gaelic
  ka = "ka", // Georgian
  de = "de", // German
  el = "el", // Greek
  he = "he", // Hebrew
  hi = "hi", // Hindi
  hu = "hu", // Hungarian
  is = "is", // Icelandic
  id = "id", // Indonesian
  ga = "ga", // Irish
  it = "it", // Italian
  ja = "ja", // Japanese
  jv = "jv", // Javanese
  kn = "kn", // Kannada
  ks = "ks", // Kashmiri
  kk = "kk", // Kazakh
  ky = "ky", // Kyrgyz
  kg = "kg", // Kongo
  ko = "ko", // Korean
  la = "la", // Latin
  lv = "lv", // Latvian
  lt = "lt", // Lithuanian
  lb = "lb", // Luxembourgish
  ml = "ml", // Malayalam
  mt = "mt", // Maltese
  mn = "mn", // Mongolian
  ne = "ne", // Nepali
  no = "no", // Norwegian
  fa = "fa", // Persian
  pl = "pl", // Polish
  pt = "pt", // Portugese
  pa = "pa", // Punjabi
  ro = "ro", // Romanian
  ru = "ru", // Russian
  sr = "sr", // Serbian
  sk = "sk", // Slovak
  sl = "sl", // Slovenian
  so = "so", // Somali
  es = "es", // Spanish
  sv = "sv", // Swedish
  ty = "ty", // Tahitian
  tg = "tg", // Tajik
  ta = "ta", // Tamil
  th = "th", // Thai
  tr = "tr", // Turkish
  tk = "tk", // Turkmen
  uk = "uk", // Ukrainian
  uz = "uz", // Uzbek
  vi = "vi", // Vietnamese
  cy = "cy", // Welsh
  zu = "zu", // Zulu
}

/**
 * Array that contains all defined ISO language codes
 */
export const IsoLanguageCodes = Object.keys(IsoLanguage)
  .filter((k) => typeof IsoLanguage[k] === "string")
  .sort();

/**
 * Label to be shown in the UI. Constructed as the ISO language name
 * and its endonyms listed on the wikipedia page:
 * https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
 */
export const IsoLanguageLabels: { [key in IsoLanguage]: string } = {
  ab: "Abkhazian; Аҧсуа; Apsua; აფსუა",
  sq: "Albanian; Shqip",
  ar: "Arabic; اَلْعَرَبِيَّةُ",
  hy: "Armenian; Հայերեն; Hayeren",
  az: "Azerbaijani; آذربایجان دیلی; Азәрбајҹан дили",
  be: "Belarusian; Беларуская мова",
  bn: "Bengali; বাংলা; Bāŋlā",
  bs: "Bosnian; Босански; Bosanski",
  bg: "Bulgarian; Български; Bulgarski",
  my: "Burmese; Myanmar; မြန်မာစာ; Mrãmācā",
  ca: "Catalan; Valencian; Català; Valencià",
  zh: "Chinese; 中文; Zhōngwén; 汉语; 漢語; Hànyǔ",
  hr: "Croatian; Hrvatski",
  cs: "Czech; Čeština",
  da: "Danish; Dansk",
  nl: "Dutch; Nederlands",
  en: "English",
  et: "Estonian; Eesti keel",
  fi: "Finnish; Suomi",
  fr: "French; Français",
  gd: "Gaelic; Gàidhlig",
  ka: "Georgian; ქართული; Kharthuli",
  de: "German; Deutsch",
  el: "Greek; Νέα Ελληνικά; Néa Ellêniká",
  he: "Hebrew; עברית; Ivrit",
  hi: "Hindi; हिन्दी; Hindī",
  hu: "Hungarian; Magyar nyelv",
  is: "Icelandic; Íslenska",
  id: "Indonesian; bahasa Indonesia",
  ga: "Irish; Gaeilge",
  it: "Italian; Italiano",
  ja: "Japanese; 日本語; Nihongo",
  jv: "Javanese; basa Jawa",
  kn: "Kannada; ಕನ್ನಡ; Kannađa",
  ks: "Kashmiri; कॉशुर; كأشُر; Kosher",
  kk: "Kazakh; Қазақша; Qazaqşa; قازاقشا",
  ky: "Kyrgyz; Кыргыз; قىرعىز",
  kg: "Kongo; Kikongo",
  ko: "Korean; 한국어; Hangugeo; 조선말; Chosŏnmal",
  la: "Latin; Latinum",
  lv: "Latvian; Latviski",
  lt: "Lithuanian; Lietuvių",
  lb: "Luxembourgish; Lëtzebuergesch",
  ml: "Malayalam; മലയാളം; Malayāļã",
  mt: "Maltese; Malti",
  mn: "Mongolian; Монгол хэл",
  ne: "Nepali; नेपाली भाषा; Nepālī bhāśā",
  no: "Norwegian; Norsk",
  fa: "Persian; فارسی; Fārsiy",
  pl: "Polish; Polski",
  pt: "Portugese; Português",
  pa: "Punjabi; ਪੰਜਾਬੀ; پنجابی; Pãjābī",
  ro: "Romanian; Moldovan; Română; Ромынэ",
  ru: "Russian; Русский язык; Russkiĭ âzyk",
  sr: "Serbian; Српски; Srpski",
  sk: "Slovak; Slovenčina",
  sl: "Slovenian; Slovenščina",
  so: "Somali; 𐒈𐒝𐒑𐒛𐒐𐒘",
  es: "Spanish; Castilian; Español; Castellano",
  sv: "Swedish; Svenska",
  ty: "Tahitian; reo Tahiti",
  tg: "Tajik; Тоҷикӣ; Tojikī",
  ta: "Tamil; தமிழ்",
  th: "Thai; ภาษาไทย; Phasa Thai",
  tr: "Turkish; Türkçe",
  tk: "Turkmen; Türkmençe; Түркменче; تۆرکمنچه",
  uk: "Ukrainian; Українська; Ukraїnska",
  uz: "Uzbek; Ózbekça; ўзбекча; ئوزبېچه",
  vi: "Vietnamese; tiếng Việt",
  cy: "Welsh; Cymraeg",
  zu: "Zulu; isiZulu",
};
