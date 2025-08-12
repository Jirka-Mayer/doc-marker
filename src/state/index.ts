/*
  This file groups multiple lazy imports into one lazy import,
  thereby improving performance by not downloading 30 small files
  when the application loads.

  Import this file from outside the "state" folder, instead of
  importing the individual sub-files to keep the "state" folder
  a single bundle - downloaded by the browser only once.
 */

// public classes
import { AppMode } from "./editor/AppMode";
import { AppFile } from "./file/AppFile";
import { FileStorage } from "./file/FileStorage";
import { FileStorageRecord } from "./file/FileStorageRecord";
import { Migration } from "./file/Migration";
import { FieldsRepository } from "./form/FieldsRepository";
import { FieldState } from "./form/FieldState";
import { AtomGroup } from "./AtomGroup";

// public methods
import { runAutomaticExtraction } from "./editor/runAutomaticExtraction";

// state stores
import { AutosaveStore } from "./AutosaveStore";
import * as editorStore from "./editorStore";
import * as fileStore from "./fileStore";
import * as formStore from "./formStore";
import * as historyStore from "./historyStore";
import * as reportStore from "./reportStore";
import * as userPreferencesStore from "./userPreferencesStore";

export {
  // public classes
  AppMode,
  AppFile,
  FileStorage,
  FileStorageRecord,
  Migration,
  FieldsRepository,
  FieldState,
  AtomGroup,

  // public methods
  runAutomaticExtraction,

  // state stores
  AutosaveStore,
  editorStore,
  fileStore,
  formStore,
  historyStore,
  reportStore,
  userPreferencesStore,
};
