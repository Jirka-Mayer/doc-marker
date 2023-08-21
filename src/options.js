import _ from "lodash"
import localeDefinitions from "../locales"
import formDefinitions from "../forms"

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
    version: "1.0.0",

    /**
     * Logo displayed in the app bar (top left corner of the screen)
     */
    appBarLogoUrl: new URL("./logo.svg", import.meta.url)
  },

  /**
   * Dictionary of all locales
   */
  locales: {
    ...localeDefinitions // imported from "/locales/index.js"
  },

  /**
   * Locale to be used as the fallback
   */
  fallbackLocale: "en-GB",

  /**
   * MUI library theming options
   */
  theme: {
    /*
      MUI Theme options, as described here:
      https://mui.com/material-ui/customization/theming/

      You can use the theme creator here:
      https://zenoo.github.io/mui-theme-creator/
    */
  },

  /**
   * Dictionary of all forms
   */
  forms: {
    ...formDefinitions // imported from "/forms/index.js"
  },

  /**
   * Which form to use by default
   */
  defaultFormId: "DocMarker Testing Form",

  /**
   * Prefix for keys in the local storage
   * (useful for running multiple customizations from one domain)
   */
  localStoragePrefix: "DocMarker::"
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
