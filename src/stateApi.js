import _ from "lodash"

/**
 * State namespace containing stores, types and utils
 */
export let stateApi = {}

export async function importStateApi() {
  _.merge(stateApi, {
    autosaveStore: await import("./state/autosaveStore.js"),
    editorStore: await import("./state/editorStore.js"),
    fileStore: await import("./state/fileStore.js"),
    formStore: await import("./state/formStore.js"),
    historyStore: await import("./state/historyStore.js"),
    reportStore: await import("./state/reportStore.js"),
    userPreferencesStore: await import("./state/userPreferencesStore.js"),
    AtomGroup: (await import("./state/AtomGroup")).AtomGroup,
    FieldState: (await import("./state/form/FieldState")).FieldState,
    AppMode: (await import("./state/editor/AppMode")).AppMode,
    AppFile: (await import("./state/file/AppFile")).AppFile,
    Migration: (await import("./state/file/Migration")).Migration
  })
}