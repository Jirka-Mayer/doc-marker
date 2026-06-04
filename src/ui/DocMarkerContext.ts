import { createContext, useMemo } from "react";
import { FileSerializer } from "../state/file/FileSerializer";
import { JotaiStore } from "../state/JotaiStore";
import { getDefaultStore } from "jotai";
import { RobotPredictionStore } from "../state/form/RobotPredictionStore";
import { DmOptions } from "../options";
import { LocalesRepository } from "../../locales/LocalesRepository";
import { FormsRepository } from "../../forms/FormsRepository";
import { AutosaveStore } from "../state/AutosaveStore";
import { FieldsRepository } from "../state/form/FieldsRepository";
import { FileMetadataStore } from "../state/file/FileMetadataStore";
import { FilesDatabase } from "../state/file/FilesDatabase";
import { FileStateManager } from "../state/file/FileStateManager";
import { HistoryStore } from "../state/HistoryStore";
import { RobotPredictor } from "../state/RobotPredictor";
import { QuillExtended } from "../quill/QuillExtended";
import { ReportStore } from "../state/ReportStore";
import { EditorStore } from "../state/EditorStore";
import { FormStore } from "../state/FormStore";

/**
 * The DocMarker context acts as a service container for the whole application,
 * holding services and state stores responsible for the logic underneatch
 * all the React UI. All the services are singletons, created during the
 * booting of the app.
 */
export interface DocMarkerContextState {
  /**
   * Options for DocMarker provided by the customization that invoked the
   * bootstrap method
   */
  readonly dmOptions: DmOptions;

  /**
   * Provides a factory and persistance for application locales (translations)
   */
  readonly localesRepository: LocalesRepository;

  /**
   * Provides a factory for application forms
   */
  readonly formsRepository: FormsRepository;

  /**
   * The jotai store, that lets us manipulate jotai atoms from outside of react
   */
  readonly jotaiStore: JotaiStore;

  /**
   * Provides access to files persisted in web browser's local storage
   */
  readonly filesDatabase: FilesDatabase;

  /**
   * Holds metadata about the currently openned file
   */
  readonly fileMetadataStore: FileMetadataStore;

  /**
   * Holds application state needed for the UI of the editor,
   * which does not belong to the annotated data.
   * (application modes, active field, etc.)
   */
  readonly editorStore: EditorStore;

  /**
   * Holds the text in the report column. Is fully non-React,
   * but should be used to command changes to the state
   * and possibly query the state from outside React.
   */
  readonly quillExtended: QuillExtended;

  /**
   * Encapsulates the report column text state in a way
   * that's consumable by React (read-only) and also holds
   * additional state that is not already present in QuillExtended.
   */
  readonly reportStore: ReportStore;

  /**
   * Encapsulates the JSON Forms form data state in a way
   * that makes it easy to consume from the rest of the application.
   */
  readonly formStore: FormStore;

  /**
   * Keeps track of fields in the form, their visibility and value
   */
  readonly fieldsRepository: FieldsRepository;

  /**
   * Keeps state related to the automatic robot form filling
   */
  readonly robotPredictionStore: RobotPredictionStore;

  /**
   * Is responsible purely for serialization and deserialization
   * of files. During deserialization, it hydrates all the stores.
   * During serialization, it reads those stores and creates the JSON file.
   */
  readonly fileSerializer: FileSerializer;

  /**
   * Service that orchestrates the robot prediction logic
   */
  readonly robotPredictor: RobotPredictor;

  /**
   * Tracks ans snapshots changes in the state of the app to provide undo/redo
   */
  readonly historyStore: HistoryStore;

  /**
   * Contains logic for loading and saving files
   */
  readonly fileStateManager: FileStateManager;

  /**
   * Observes the history store for idling and triggers file saves
   */
  readonly autosaveStore: AutosaveStore;
}

/**
 * Creates all services and stores them in the global context
 */
export function useConstructContextServices(
  dmOptions: DmOptions,
  localesRepository: LocalesRepository,
): DocMarkerContextState {
  const formsRepository = useMemo(() => new FormsRepository(dmOptions), []);
  const jotaiStore = useMemo(() => getDefaultStore(), []);
  const filesDatabase = useMemo(
    () => new FilesDatabase(dmOptions, jotaiStore),
    [],
  );
  const fileMetadataStore = useMemo(
    () => new FileMetadataStore(jotaiStore),
    [],
  );
  const editorStore = useMemo(() => new EditorStore(jotaiStore), []);
  const quillExtended = useMemo(() => new QuillExtended(editorStore), []);
  const reportStore = useMemo(
    () => new ReportStore(jotaiStore, quillExtended),
    [],
  );
  const formStore = useMemo(() => new FormStore(jotaiStore), []);
  const fieldsRepository = useMemo(() => new FieldsRepository(jotaiStore), []);
  const robotPredictionStore = useMemo(
    () =>
      new RobotPredictionStore(
        jotaiStore,
        quillExtended,
        reportStore,
        fieldsRepository,
      ),
    [],
  );
  const fileSerializer = useMemo(
    () =>
      new FileSerializer(
        dmOptions,
        jotaiStore,
        fileMetadataStore,
        quillExtended,
        reportStore,
        formStore,
        fieldsRepository,
        editorStore,
        robotPredictionStore,
      ),
    [],
  );
  const robotPredictor = useMemo(
    () =>
      new RobotPredictor(
        jotaiStore,
        quillExtended,
        reportStore,
        formStore,
        fieldsRepository,
        dmOptions.robot,
        robotPredictionStore,
      ),
    [],
  );
  const historyStore = useMemo(
    () =>
      new HistoryStore(
        jotaiStore,
        quillExtended,
        reportStore,
        formStore,
        editorStore,
        robotPredictionStore,
      ),
    [],
  );
  const fileStateManager = useMemo(
    () =>
      new FileStateManager(
        dmOptions,
        filesDatabase,
        fileSerializer,
        fileMetadataStore,
        historyStore,
      ),
    [],
  );
  const autosaveStore = useMemo(
    () => new AutosaveStore(jotaiStore, fileStateManager, historyStore),
    [],
  );

  return {
    autosaveStore,
    dmOptions,
    fieldsRepository,
    fileMetadataStore,
    quillExtended,
    reportStore,
    formStore,
    filesDatabase,
    fileSerializer,
    fileStateManager,
    formsRepository,
    historyStore,
    jotaiStore,
    localesRepository,
    robotPredictionStore,
    robotPredictor,
    editorStore,
  };
}

export const DocMarkerContext = createContext<DocMarkerContextState>(null!);
