// this file exports locale parameters for all locales

export default {
  "cs": {
    title: "Česky",
    importer: async () => await import("./cs"),
    momentLocale: "cs"
  },
  "en-GB": {
    title: "English (United Kingdom)",
    importer: async () => await import("./en-GB"),
    momentLocale: "en-gb"
  },
  "en-US": {
    title: "English (United States)",
    importer: async () => await import("./en-US"),
    momentLocale: "en"
  },
}