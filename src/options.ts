import _ from "lodash";
import localeDefinitions from "../locales";
import formDefinitions from "../forms";

/*
    This file holds the global doc-marker options object,
    used to configure or extend the tool.
 */

//////////////////////
// Type definitions //
//////////////////////

/**
 * Complete options that DocMarker requires to start up
 */
export interface DmOptions {
  /**
   * The DOM element to which to bind the application.
   * Null is the default if not provided, but it will cause the
   * startup to fail. The app must be bound to some element.
   */
  element: HTMLElement | null;

  /**
   * Holds options regarding your DocMarker customization as such
   */
  customization: DmCustomizationOptions;

  /**
   * A dictionary of all locales
   */
  locales: DmLocalesOptions;

  /**
   * Locale ID to be used as the fallback
   */
  fallbackLocale: string;

  /**
   * MUI library theming options
   * https://mui.com/material-ui/customization/theming/
   *
   * You can use the theme creator here:
   * https://zenoo.github.io/mui-theme-creator/
   */
  theme: any;

  /**
   * Dictionary of all available forms
   */
  forms: DmFormsOptions;

  /**
   * Which form ID to use by default
   */
  defaultFormId: string;

  /**
   * JSON Forms renderers importer
   * (async so that components get imported after options are set)
   */
  formRenderersImporter: () => Promise<object[]>;

  /**
   * Json Forms cells importer
   * (async so that components get imported after options are set)
   */
  formCellsImporter: () => Promise<object[]>;

  /**
   * Prefix for keys in the local storage
   * (useful for running multiple customizations from one domain)
   */
  localStoragePrefix: string;

  /**
   * Options regarding file (de)serialization
   */
  file: DmFileOptions;

  /**
   * React slots for inserting react components into various places
   * of the Doc Marker application
   */
  slots: DmSlotsOptions;

  /**
   * Additional slots that are imported after bootstrapping finishes
   * and the response object is merged with the slots option
   */
  slotsImporter: () => Promise<PartialDmSlotsOptions>;
}

/**
 * Holds options regarding your DocMarker customization as such
 */
export interface DmCustomizationOptions {
  /**
   * Name of your DocMarker customization.
   * The value is used in the UI.
   */
  name: string;

  /**
   * Version of your customized application
   */
  version: string;

  /**
   * Logo displayed in the app bar (top left corner of the screen)
   */
  appBarLogoUrl: URL;
}

/**
 * A dictionary of all locales
 */
export interface DmLocalesOptions {
  [localeId: string]: LocaleDefinition;
}

/**
 * Defines a single locale in the options object
 */
export interface LocaleDefinition {
  /**
   * Human-readabel name of the locale in the locale's language
   */
  title: string;

  /**
   * Async function that loads the locale's i18n namespaces
   */
  importer: () => Promise<any>;

  /**
   * Corresponding locale code for the moment.js library
   */
  momentLocale: string;
}

/**
 * Dictionary of all available forms
 */
export interface DmFormsOptions {
  [formId: string]: FormDefinition;
}

/**
 * Definition of a single form in the options object
 */
export interface FormDefinition {
  /**
   * Async function that imports the json schema for the form data
   */
  dataSchemaImporter: () => Promise<object>;

  /**
   * Async function that imports the UI schema for the JSON Forms library
   */
  uiSchemaImporter: () => Promise<object>;

  /**
   * Importers for translations of form text into various locales
   */
  translationImporters: {
    [localeId: string]: () => Promise<object>;
  };
}

/**
 * Options regarding file (de)serialization
 */
export interface DmFileOptions {
  /**
   * What version is the app currently storing
   * (can be int or string, whatever the migrations accept, can even be ignored)
   */
  currentVersion: number | string | undefined;

  /**
   * A set of migrations to be applied to a loaded file.
   * They are all tested and run in a loop until no more test positive.
   */
  migrations: FileMigration[];

  /**
   * Callback that lets you modify the file when being saved,
   * for example by adding custom state
   */
  onSerialize: (fileJson: object) => object;

  /**
   * Callback that lets you modify a file when an empty one is being created,
   * for example to initialize custom state to its default values.
   * Deserialization is performed after the empty file is created.
   */
  onCreateEmpty: (fileJson: object) => object;

  /**
   * Callback that is called on file loading, that lets you load custom state
   */
  onDeserialize: (fileJson: object) => void;
}

/**
 * Defines a single migration for DocMarker files
 */
export interface FileMigration {
  /**
   * Human-readable name of the migration
   */
  title: string;

  /**
   * Tests whether the migration should be applied to the file
   */
  test: (fileJson: object) => boolean;

  /**
   * Implements the migration, inputting file JSON and outputting
   * the modified file JSON
   */
  run: (fileJson: object) => object;
}

/**
 * React slots for inserting react components into various places
 * of the Doc Marker application
 */
export interface DmSlotsOptions {
  /**
   * List additional dialog windows here
   */
  dialogs: JSX.Element | null;

  /**
   * Additional actions in the tools menu
   */
  toolsMenu: JSX.Element | null;
}

///////////////////
// Partial types //
///////////////////

// magic that makes all fields optional
// https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined
      ? RecursivePartial<T[P]>
      : T[P];
};

/**
 * Subset of options to override the defaults with
 * when bootstrapping DocMarker
 */
export type PartialDmOptions = RecursivePartial<DmOptions> & {
  // see the `mergeOptions` function to learn how partials are merged
  forms?: DmFormsOptions; // not recursively partial
};

export type PartialDmCustomizationOptions =
  RecursivePartial<DmCustomizationOptions>;

export type PartialDmSlotsOptions = RecursivePartial<DmSlotsOptions>;

/////////////////////////////////////
// Options values and manipulation //
/////////////////////////////////////

/**
 * The default values for DocMarker options
 */
export const defaultOptions: DmOptions = {
  element: null,
  customization: {
    name: "Plain DocMarker",
    version: "1.0.0",
    appBarLogoUrl: new URL("./img/logo.svg", import.meta.url),
  },
  locales: {
    ...localeDefinitions, // imported from "/locales/index.js"
  },
  fallbackLocale: "en-GB",
  theme: {},
  forms: {
    ...formDefinitions, // imported from "/forms/index.js"
  },
  defaultFormId: "DocMarker Testing Form",
  formRenderersImporter: async () =>
    (await import("./ui/form/formRenderersAndCells")).formRenderers,
  formCellsImporter: async () =>
    (await import("./ui/form/formRenderersAndCells")).formCells,
  localStoragePrefix: "DocMarker::",
  file: {
    currentVersion: 1,
    migrations: [
      /* Example migration definition */
      // {
      //   title: "My migration v1 -> v2",
      //   test: (fileJson) => fileJson["_version"] === 1,
      //   run: (fileJson) => {
      //     fileJson["_version"] = 2
      //     fileJson["foo"] = "bar"
      //     return fileJson
      //   }
      // }
    ],
    onSerialize: (fileJson) => fileJson,
    onCreateEmpty: (fileJson) => fileJson,
    onDeserialize: (fileJson) => {},
  },
  slots: {
    dialogs: null,
    toolsMenu: null,
  },
  slotsImporter: () => Promise.resolve({}),
};

/**
 * The globally available options for the DocMarker application
 */
export const currentOptions: DmOptions = _.merge({}, defaultOptions);

/**
 * Sets the DocMarker global options, used by the bootstrapping function
 *
 * @param givenOptions Subset of options to set
 * @param additive If true, it modifies them relative to their
 * current state, else it resets them to their defaults and then
 * overwrites the provided subset
 */
export function setOptions(givenOptions: PartialDmOptions, additive = false) {
  // reset to defaults if not "additive"
  if (!additive) {
    // clear current options
    for (let key in currentOptions) {
      if (currentOptions.hasOwnProperty(key)) {
        delete currentOptions[key];
      }
    }

    // initialize to default
    mergeOptions(currentOptions, defaultOptions);
  }

  // override current options with the given subset
  mergeOptions(currentOptions, givenOptions);
}

function mergeOptions(current: DmOptions, given: PartialDmOptions) {
  // do a deep object merge, as this is a sensible default
  _.merge(current, given);

  // overwrite all theme definitions (no recursive merging)
  if (given.theme) current.theme = given.theme;

  // overwrite all form definitions (no recursive merging)
  if (given.forms) current.forms = given.forms;
}
