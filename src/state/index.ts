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
import { FilesDatabaseRecord } from "./file/FilesDatabaseRecord";
import { Migration } from "./file/Migration";
import { FieldsRepository } from "./form/FieldsRepository";
import { FieldState } from "./form/FieldState";
import { AtomGroup } from "./AtomGroup";

// public services
import { AutosaveStore } from "./AutosaveStore";
import * as editorStore from "./editorStore";
import { FilesDatabase } from "./file/FilesDatabase";
import { FileMetadataStore } from "./file/FileMetadataStore";
import { FileStateManager } from "./file/FileStateManager";
import * as formStore from "./formStore";
import * as historyStore from "./historyStore";
import * as reportStore from "./reportStore";
import * as userPreferencesStore from "./userPreferencesStore";
import { RobotPredictor } from "./RobotPredictor";

export {
  // public classes
  AppFile,
  AppMode,
  AtomGroup,
  FieldsRepository,
  FieldState,
  FilesDatabaseRecord,
  Migration,

  // public services
  AutosaveStore,
  editorStore,
  FileMetadataStore,
  FilesDatabase,
  FileStateManager,
  formStore,
  historyStore,
  reportStore,
  userPreferencesStore,
  RobotPredictor,
};
