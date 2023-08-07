// This file exports form importers for all form IDs

export default {

  /**
   * Official ResQ 3.1.1
   */
  "Official ResQ 3.1.1": {
    dataSchemaImporter: async () => await import("./Official ResQ 3.1.1/schema.json"),
    uiSchemaImporter: async () => await import("./Official ResQ 3.1.1/uischema.json"),
    translationImporters: {
      "cs": async () => await import("./Official ResQ 3.1.1/dictionary_cz.json"),
      "en-GB": async () => await import("./Official ResQ 3.1.1/dictionary_en.json"),
      // en-US falls back on en-GB
    }
  },
  
  /**
   * ResQPlus Alpha 1.0
   */
  "ResQPlus Alpha 1.0": {
    dataSchemaImporter: async () =>
      (await import("./ResQPlus Alpha 1.0/data-schema.js")).default,
    uiSchemaImporter: async () =>
      (await import("./ResQPlus Alpha 1.0/ui-schema.js")).default,
    translationImporters: {
      "cs": async () => await import("./ResQPlus Alpha 1.0/translations/cs.json"),
      "en-GB": async () => await import("./ResQPlus Alpha 1.0/translations/en-GB.json"),
      // en-US falls back on en-GB
    }
  },

}