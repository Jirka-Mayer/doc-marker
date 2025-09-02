import {
  AppFile,
  editorStore,
  FieldsRepository,
  formStore,
  Migration,
  reportStore,
} from "..";
import { currentOptions } from "../../options";
import * as packageJson from "../../../package.json";
import { FileMetadataStore } from "./FileMetadataStore";
import { JotaiStore } from "../JotaiStore";
import { SerializedFileJson } from "./SerializedFileJson";
import { forgetAnonymizedText } from "./forgetAnonymizedText";

const DOC_MARKER_VERSION: string = packageJson["version"];

/**
 * Service responsible for (de)serialization of file state.
 * During serialization, it takes the application file state from various
 * stores and services and builds the JSON file representing that state.
 * During deserialization, it parses the given JSON file, applies migrations,
 * and hydrates the state stores and services with this data.
 */
export class FileSerializer {
  private readonly jotaiStore: JotaiStore;
  private readonly fileMeta: FileMetadataStore;
  private readonly fieldsRepository: FieldsRepository;

  constructor(
    jotaiStore: JotaiStore,
    fileMeta: FileMetadataStore,
    fieldsRepository: FieldsRepository,
  ) {
    this.jotaiStore = jotaiStore;
    this.fileMeta = fileMeta;
    this.fieldsRepository = fieldsRepository;
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
      _version: currentOptions.file.currentVersion,
      _docMarkerVersion: DOC_MARKER_VERSION,
      _docMarkerCustomizationVersion: currentOptions.customization.version,
      _docMarkerCustomizationName: currentOptions.customization.name,

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
    };

    fileJson = forgetAnonymizedText(fileJson);

    fileJson = currentOptions.file.onSerialize(fileJson) as SerializedFileJson;

    return AppFile.fromJson(fileJson);
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

    json = Migration.runMigrations(json, currentOptions.file.migrations);

    // === deserialize state ===

    this.fileMeta.fileUuid = json._uuid;
    this.fileMeta.fileName = json._fileName;
    this.fileMeta.fileCreatedAt = new Date(json._createdAt);
    // _updatedAt is ignored, since it's overwritten during save anyways

    this.jotaiStore.set(editorStore.appModeAtom, json._appMode);

    this.jotaiStore.set(formStore.formIdAtom, json._formId);
    this.jotaiStore.set(formStore.formDataAtom, json._formData);

    reportStore.quillExtended.setContents(json._reportDelta, "api");
    // _reportText and _highlights are ignored, since they are computable from delta
    this.jotaiStore.set(
      reportStore.reportLanguageAtom,
      json._reportLanguage || null,
    );

    // === post-deserialization logic ===

    // force the form reload
    this.jotaiStore.set(formStore.formReloadTriggerAtom);

    // let the customization deserialize its own additional state
    currentOptions.file.onDeserialize(json);
  }
}
