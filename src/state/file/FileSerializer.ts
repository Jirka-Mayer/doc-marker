import * as editorStore from "../editorStore";
import * as formStore from "../formStore";
import * as reportStore from "../reportStore";
import { Migration } from "../file/Migration";
import { DmOptions } from "../../options";
import * as packageJson from "../../../package.json";
import { FileMetadataStore } from "./FileMetadataStore";
import { JotaiStore } from "../JotaiStore";
import {
  SerializedFileJson,
  SerializedRobotPredictions,
} from "./SerializedFileJson";
import { forgetAnonymizedText } from "./forgetAnonymizedText";
import {
  FieldPrediction,
  RobotPredictionStore,
} from "../form/RobotPredictionStore";
import { AppFile } from "./AppFile";
import { FieldsRepository } from "../form/FieldsRepository";

const DOC_MARKER_VERSION: string = packageJson["version"];

/**
 * Service responsible for (de)serialization of file state.
 * During serialization, it takes the application file state from various
 * stores and services and builds the JSON file representing that state.
 * During deserialization, it parses the given JSON file, applies migrations,
 * and hydrates the state stores and services with this data.
 */
export class FileSerializer {
  private readonly dmOptions: DmOptions;
  private readonly jotaiStore: JotaiStore;
  private readonly fileMeta: FileMetadataStore;
  private readonly fieldsRepository: FieldsRepository;
  private readonly robotPredictionStore: RobotPredictionStore;

  constructor(
    dmOptions: DmOptions,
    jotaiStore: JotaiStore,
    fileMeta: FileMetadataStore,
    fieldsRepository: FieldsRepository,
    robotPredictionStore: RobotPredictionStore,
  ) {
    this.dmOptions = dmOptions;
    this.jotaiStore = jotaiStore;
    this.fileMeta = fileMeta;
    this.fieldsRepository = fieldsRepository;
    this.robotPredictionStore = robotPredictionStore;
  }

  /**
   * Executing this function will serialize the currently open file
   * to an AppFile instance, or to null if no file is open
   */
  public serializeToFile(): AppFile | null {
    if (!this.fileMeta.isFileOpen) {
      return null;
    }

    let fileJson: SerializedFileJson = {
      _version: this.dmOptions.file.currentVersion,
      _docMarkerVersion: DOC_MARKER_VERSION,
      _docMarkerCustomizationVersion: this.dmOptions.customization.version,
      _docMarkerCustomizationName: this.dmOptions.customization.name,

      _uuid: this.fileMeta.fileUuid!, // there is a check above
      _fileName: this.fileMeta.fileName,
      _createdAt: this.fileMeta.fileCreatedAt.toISOString(),
      _updatedAt: new Date().toISOString(),

      _appMode: this.jotaiStore.get(editorStore.appModeAtom),

      _formId: this.jotaiStore.get(formStore.formIdAtom),
      _formData: this.fieldsRepository.getExportedFormData(),

      _reportDelta: this.jotaiStore.get(reportStore.contentAtom),
      _reportText: reportStore.quillExtended.getText(),
      _reportLanguage:
        this.jotaiStore.get(reportStore.reportLanguageAtom) || undefined,
      _highlights: this.jotaiStore.get(reportStore.highlightsAtom),
      _robotPredictions: this.serializeRobotPredictions(),
    };

    // TODO: anonymization must be done earlier!
    fileJson = forgetAnonymizedText(fileJson);

    fileJson = this.dmOptions.file.onSerialize(fileJson) as SerializedFileJson;

    return AppFile.fromJson(this.dmOptions, fileJson);
  }

  private serializeRobotPredictions(): SerializedRobotPredictions {
    let predictions: SerializedRobotPredictions = {};
    const fieldIds = this.robotPredictionStore.getPredictedVisibleFieldIds();
    for (const fieldId of fieldIds) {
      const p: FieldPrediction =
        this.robotPredictionStore.getFieldPrediction(fieldId);
      if (p.robot === null) {
        continue; // these should not be present in the list, but skip anyways
      }
      predictions[fieldId] = {
        evidences: p.robot.evidences,
        answer: p.robot.answer,
        evidencesMatchHighlights: p.evidencesMatchHighlights,
        answerMatchesFormData: p.answerMatchesFormData,
        wholePredictionMatchesData: p.wholePredictionMatchesData,
        evidenceModelVersion: p.robot.evidenceModelVersion,
        predictionModelVersion: p.robot.predictionModelVersion,
        evidenceMetadata: p.robot.evidenceMetadata,
        predictionMetadata: p.robot.predictionMetadata,
        isHumanVerified: p.isHumanVerified,
      };
    }
    return predictions;
  }

  /**
   * Calling this function will deserialize the given app file into the
   * application state. Providing null will reset the editor to "no file" state.
   * @param {AppFile} appFile
   */
  public deserializeFromFile(appFile: AppFile): void {
    if (appFile === null) {
      this.fileMeta.fileUuid = null;
      return;
    }

    let json: SerializedFileJson = appFile.toJson();

    json = Migration.runMigrations(json, this.dmOptions.file.migrations);

    // === deserialize state ===

    this.fileMeta.fileUuid = json._uuid;
    this.fileMeta.fileName = json._fileName;
    this.fileMeta.fileCreatedAt = new Date(json._createdAt);
    // _updatedAt is ignored, since it's overwritten during save anyways

    this.jotaiStore.set(editorStore.appModeAtom, json._appMode);

    this.jotaiStore.set(formStore.formIdAtom, json._formId);
    this.jotaiStore.set(formStore.formDataAtom, json._formData);

    reportStore.quillExtended.setContents(json._reportDelta, "api");
    // _reportText is ignored, since it is computable from the delta
    this.jotaiStore.set(
      reportStore.reportLanguageAtom,
      json._reportLanguage || null,
    );
    // _highlights are ignored, since they are computable from the delta
    this.deserializeRobotPredictions(json._robotPredictions || {});

    // === post-deserialization logic ===

    // force the form reload
    this.jotaiStore.set(formStore.formReloadTriggerAtom);

    // let the customization deserialize its own additional state
    this.dmOptions.file.onDeserialize(json);
  }

  private deserializeRobotPredictions(
    robotPredictions: SerializedRobotPredictions,
  ): void {
    for (const fieldId of Object.keys(robotPredictions)) {
      const p = robotPredictions[fieldId];
      this.robotPredictionStore.loadDeserializedStateForField(
        fieldId,
        {
          evidences: p.evidences,
          answer: p.answer,
          evidenceModelVersion: p.evidenceModelVersion,
          predictionModelVersion: p.predictionModelVersion,
          evidenceMetadata: p.evidenceMetadata,
          predictionMetadata: p.predictionMetadata,
        },
        {
          isBeingPredicted: false,
          isHumanVerified: p.isHumanVerified || false,
        },
      );
    }
  }
}
