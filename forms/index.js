// This file exports form importers for all form IDs

export default {
  
  /**
   * ResQPlus Alpha 1.0
   */
  "ResQPlus Alpha 1.0": async () => { return {
    dataSchema: (await import("./ResQPlus Alpha 1.0/data-schema.js")).default,
    uiSchema: (await import("./ResQPlus Alpha 1.0/ui-schema.js")).default,
    translationImporters: {
      "cs": async () => await import("./ResQPlus Alpha 1.0/translations/cs.json"),
      "en-GB": async () => await import("./ResQPlus Alpha 1.0/translations/en-GB.json"),
      // en-US falls back on en-GB
    }
  }},

  /**
   * ResQPlus AppDevelopmentForm 1.0 CZ
   */
  "ResQPlus AppDevelopmentForm 1.0 CZ": async () => { return {
    dataSchema: await import("./ResQPlus AppDevelopmentForm 1.0 CZ/data-schema.json"),
    uiSchema: await import("./ResQPlus AppDevelopmentForm 1.0 CZ/ui-schema.json")
  }},

  /**
   * simple-dump
   */
  "simple-dump": async () => { return {
    dataSchema: await import("./simple-dump/data-schema.json"),
    uiSchema: await import("./simple-dump/ui-schema.json")
  }},

}