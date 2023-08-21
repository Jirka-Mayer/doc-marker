// This file exports form importers for all form IDs

export default {

  /**
   * DocMarker Testing Form
   */
  "DocMarker Testing Form": {
    dataSchemaImporter: async () => await import("./DocMarker Testing Form/schema.json"),
    uiSchemaImporter: async () => await import("./DocMarker Testing Form/uischema.json"),
    translationImporters: {
      "cs": async () => await import("./DocMarker Testing Form/locale_cs.json"),
      "en-GB": async () => await import("./DocMarker Testing Form/locale_en-GB.json"),
    }
  },

}