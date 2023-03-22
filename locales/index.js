// this file exports locale parameters for all locales

export default {
  "cs": {
    title: "Česky",
    importer: () => import("./cs"),
    momentLocale: "cs"
  },
  "en-GB": {
    title: "English (United Kingdom)",
    importer: () => import("./en-GB"),
    momentLocale: "en-gb"
  },
  "en-US": {
    title: "English (United States)",
    importer: () => import("./en-US"),
    momentLocale: "en"
  },
}