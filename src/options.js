import _ from "lodash"

/*
    This file holds the global doc-marker options object,
    used to configure or extend the tool.
 */

export const defaultOptions = {
  
  /**
   * The DOM element to which to bind the application
   */
  element: null,

  /**
   * Holds options regarding your DocMarker customization as such
   */
  customization: {
    
    /**
     * Name of your DocMarker customization.
     * The value is used in the UI.
     */
    name: "Plain DocMarker",
    
    /**
     * Version of your customized application
     */
    version: "1.0.0"
  }
}

export const currentOptions = _.merge({}, defaultOptions)

export function setOptions(givenOptions) {
  // clear current options
  for (let key in currentOptions) {
    if (currentOptions.hasOwnProperty(key)) {
      delete currentOptions[key]
    }
  }

  // initialize to default
  _.merge(currentOptions, defaultOptions)

  // override with given
  _.merge(currentOptions, givenOptions)
}
