/*
  This file groups multiple lazy imports into one lazy import,
  thereby improving performance by not downloading 30 small files
  when the application loads.

  Import this file from outside the "state" folder, instead of
  importing the individual sub-files to keep the "state" folder
  a single bundle - downloaded by the browser only once.
 */

// public classes
import { AppMode } from "./editor/AppMode"
import { AppFile } from "./file/AppFile"
import { FileStorage } from "./file/FileStorage"
import { FileStorageRecord } from "./file/FileStorageRecord"
import { Migration } from "./file/Migration"
import { FieldState } from "./form/FieldState"
import { AtomGroup } from "./AtomGroup"

// public methods
import { runAutomaticExtraction } from "./editor/runAutomaticExtraction"

// jotai stores
import * as autosaveStore from "./autosaveStore.js"
import * as editorStore from "./editorStore.js"
import * as fileStore from "./fileStore.js"
import * as formStore from "./formStore.js"
import * as historyStore from "./historyStore.js"
import * as reportStore from "./reportStore.js"
import * as userPreferencesStore from "./userPreferencesStore.js"

export {
  // public classes
  AppMode,
  AppFile,
  FileStorage,
  FileStorageRecord,
  Migration,
  FieldState,
  AtomGroup,

  // public methods
  runAutomaticExtraction,

  // jotai stores
  autosaveStore,
  editorStore,
  fileStore,
  formStore,
  historyStore,
  reportStore,
  userPreferencesStore,
}
