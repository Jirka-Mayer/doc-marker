/*
  This file contains the public API of the whole DocMarker "library".
  This defines all the things you can pull out of its import:
           vvv
  import {     } from "doc-marker";

  It also acts as the entrypoint for this library's compilation.
*/

import "./parcel.d";

////////////////////////////
// Options & Boostrapping //
////////////////////////////

import {
  DmOptions,
  DmCustomizationOptions,
  DmFileOptions,
  FileMigration,
  DmSlotsOptions,
  PartialDmOptions,
  PartialDmCustomizationOptions,
  PartialDmSlotsOptions,
  getDefaultOptions,
} from "./options";

import { bootstrapDocMarker } from "./bootstrapDocMarker";

export {
  DmOptions,
  DmCustomizationOptions,
  DmFileOptions,
  FileMigration,
  DmSlotsOptions,
  PartialDmOptions,
  PartialDmCustomizationOptions,
  PartialDmSlotsOptions,
  getDefaultOptions,
  bootstrapDocMarker,
};

///////////////////////////////////////////////
// Application Services and DocMarkerContext //
///////////////////////////////////////////////

import { DocMarkerContext, DocMarkerContextState } from "./ui/DocMarkerContext";
export { DocMarkerContext, DocMarkerContextState };

import { AutosaveStore } from "./state/AutosaveStore";
import { FieldsRepository } from "./state/form/FieldsRepository";
import { FileMetadataStore } from "./state/file/FileMetadataStore";
import { FilesDatabase } from "./state/file/FilesDatabase";
import { FileSerializer } from "./state/file/FileSerializer";
import { FileStateManager } from "./state/file/FileStateManager";
import { FormsRepository } from "../forms/FormsRepository";
import { HistoryStore } from "./state/HistoryStore";
import { JotaiStore } from "./state/JotaiStore.d";
import { LocalesRepository } from "../locales/LocalesRepository";
import { RobotPredictionStore } from "./state/form/RobotPredictionStore";
import { RobotPredictor } from "./state/RobotPredictor";

export {
  AutosaveStore,
  FieldsRepository,
  FileMetadataStore,
  FilesDatabase,
  FileSerializer,
  FileStateManager,
  FormsRepository,
  HistoryStore,
  JotaiStore,
  LocalesRepository,
  RobotPredictionStore,
  RobotPredictor,
};

// legacy static stores that have yet to be refactored into services
import * as editorStore from "./state/editorStore";
import * as formStore from "./state/formStore";
import * as reportStore from "./state/reportStore";
import * as userPreferencesStore from "./state/userPreferencesStore";

export { editorStore, formStore, reportStore, userPreferencesStore };

////////////////////
// Public Classes //
////////////////////

import { AppFile } from "./state/file/AppFile";
import { AppMode } from "./state/editor/AppMode";
import { AtomGroup } from "./state/AtomGroup";
import { FilesDatabaseRecord } from "./state/file/FilesDatabaseRecord";
import { Migration } from "./state/file/Migration";

export { AppFile, AppMode, AtomGroup, FilesDatabaseRecord, Migration };

///////////////////
// Form UI Utils //
///////////////////

import { useDebouncedChange as useDebounceChangeWithCancel } from "./ui/form/useDebounceChangeWithCancel";
import { useFieldActivity } from "./ui/form/useFieldActivity";
import { useFieldHighlights } from "./ui/form/useFieldHighlights";
import { useHighlightPinButton } from "./ui/form/useHighlightPinButton";
import { useNullabilityMiddleware } from "./ui/form/useNullabilityMiddleware";
import { usePreventScrollOverNumberFields } from "./ui/form/usePreventScrollOverNumberFields";

import * as renderers from "./ui/form/renderers";
import * as rendererStyles from "./ui/form/renderers/renderers.module.scss";

export {
  useDebounceChangeWithCancel,
  useFieldActivity,
  useFieldHighlights,
  useHighlightPinButton,
  useNullabilityMiddleware,
  usePreventScrollOverNumberFields,
  renderers,
  rendererStyles,
};
