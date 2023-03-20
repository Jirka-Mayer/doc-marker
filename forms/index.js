// This file exports form importers for all form IDs

export default {
  
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