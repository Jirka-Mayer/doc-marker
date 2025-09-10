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

export type {
  DmOptions,
  DmCustomizationOptions,
  DmFileOptions,
  FileMigration,
  DmSlotsOptions,
  PartialDmOptions,
  PartialDmCustomizationOptions,
  PartialDmSlotsOptions,
} from "./options";

export { getDefaultOptions } from "./options";

export { bootstrapDocMarker } from "./bootstrapDocMarker";

///////////////////////////////////////////////
// Application Services and DocMarkerContext //
///////////////////////////////////////////////

export { DocMarkerContext } from "./ui/DocMarkerContext";
export type { DocMarkerContextState } from "./ui/DocMarkerContext";

export { AutosaveStore } from "./state/AutosaveStore";
export { FieldsRepository } from "./state/form/FieldsRepository";
export { FileMetadataStore } from "./state/file/FileMetadataStore";
export { FilesDatabase } from "./state/file/FilesDatabase";
export { FileSerializer } from "./state/file/FileSerializer";
export { FileStateManager } from "./state/file/FileStateManager";
export { FormsRepository } from "../forms/FormsRepository";
export { HistoryStore } from "./state/HistoryStore";
export { LocalesRepository } from "../locales/LocalesRepository";
export { RobotPredictionStore } from "./state/form/RobotPredictionStore";
export { RobotPredictor } from "./state/RobotPredictor";

export type { JotaiStore } from "./state/JotaiStore.d";
export type { RobotInterface } from "./robotApi/RobotInterface";
export type { AnswerPredictionRequest } from "./robotApi/AnswerPredictionRequest";
export type { AnswerPredictionResponse } from "./robotApi/AnswerPredictionResponse";
export type { EvidenceExtractionRequest } from "./robotApi/EvidenceExtractionRequest";
export type { EvidenceExtractionResponse } from "./robotApi/EvidenceExtractionResponse";
export type { ExtractedEvidence } from "./robotApi/ExtractedEvidence";
export type {
  RobotPrediction,
  FieldPrediction,
  PredictionState,
} from "./state/form/RobotPredictionStore";

// legacy static stores that have yet to be refactored into services
import * as editorStore from "./state/editorStore";
import * as formStore from "./state/formStore";
import * as reportStore from "./state/reportStore";
import * as userPreferencesStore from "./state/userPreferencesStore";
export { editorStore, formStore, reportStore, userPreferencesStore };

////////////////////
// Public Classes //
////////////////////

export { AppFile } from "./state/file/AppFile";
export { AppMode } from "./state/editor/AppMode";
export { AtomGroup } from "./state/AtomGroup";
export { FilesDatabaseRecord } from "./state/file/FilesDatabaseRecord";
export { Form } from "../forms/Form";
export { Locale } from "../locales/Locale";
export { Migration } from "./state/file/Migration";

//////////////////
// Public Types //
//////////////////

export type {
  FormDefinitions,
  FormTranslationImporters,
} from "../forms/FormDefinition";
export type { LocaleDefinitions } from "../locales/LocaleDefinition";
export type { SerializedFileJson } from "./state/file/SerializedFileJson";
export type { TextRange } from "./utils/TextRange";
export type {
  QDelta,
  QOperation,
  QInsertOp,
  QInsertEmbedOp,
  QDeleteOp,
  QRetainOp,
  QAttributes,
} from "./quill/QDelta";
export type { IsoLanguage } from "./IsoLanguage";

///////////////////
// Form UI Utils //
///////////////////

export { useDebouncedChange as useDebounceChangeWithCancel } from "./ui/form/useDebounceChangeWithCancel";
export { useFieldActivity } from "./ui/form/useFieldActivity";
export { useFieldHighlights } from "./ui/form/useFieldHighlights";
export { useHighlightPinButton } from "./ui/form/useHighlightPinButton";
export { useNullabilityMiddleware } from "./ui/form/useNullabilityMiddleware";
export { usePreventScrollOverNumberFields } from "./ui/form/usePreventScrollOverNumberFields";

import * as renderers from "./ui/form/renderers";
import * as rendererStyles from "./ui/form/renderers/renderers.module.scss";
export { renderers, rendererStyles };
