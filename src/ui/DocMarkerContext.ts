import { createContext, useMemo } from "react";
import {
  AutosaveStore,
  FieldsRepository,
  FileMetadataStore,
  FilesDatabase,
  FileStateManager,
  RobotPredictor,
} from "../state";
import { FileSerializer } from "../state/file/FileSerializer";
import { JotaiStore } from "../state/JotaiStore";
import { getDefaultStore } from "jotai";
import { DummyRobot } from "../robotApi/DummyRobot";
import { RobotPredictionStore } from "../state/form/RobotPredictionStore";

/**
 * The DocMarker context acts as a service container for the whole application,
 * holding services and state stores responsible for the logic underneatch
 * all the React UI. All the services are singletons, created during the
 * booting of the app.
 */
export interface DocMarkerContextState {
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
   * Contains logic for loading and saving files
   */
  readonly fileStateManager: FileStateManager;

  /**
   * Observes the history store for idling and triggers file saves
   */
  readonly autosaveStore: AutosaveStore;

  /**
   * Service that orchestrates the robot prediction logic
   */
  readonly robotPredictor: RobotPredictor;
}

/**
 * Creates all services and stores them in the global context
 */
export function useDocMarkerContextState(): DocMarkerContextState {
  const jotaiStore = useMemo(() => getDefaultStore(), []);
  const filesDatabase = useMemo(() => new FilesDatabase(), []);
  const fileMetadataStore = useMemo(
    () => new FileMetadataStore(jotaiStore),
    [],
  );
  const fieldsRepository = useMemo(() => new FieldsRepository(jotaiStore), []);
  const robotPredictionStore = useMemo(
    () => new RobotPredictionStore(jotaiStore, fieldsRepository),
    [],
  );
  const fileSerializer = useMemo(
    () =>
      new FileSerializer(
        jotaiStore,
        fileMetadataStore,
        fieldsRepository,
        robotPredictionStore,
      ),
    [],
  );
  const fileStateManager = useMemo(
    () =>
      new FileStateManager(filesDatabase, fileSerializer, fileMetadataStore),
    [],
  );
  const autosaveStore = useMemo(
    () => new AutosaveStore(jotaiStore, fileStateManager),
    [],
  );
  const robotPredictor = useMemo(
    () =>
      new RobotPredictor(
        jotaiStore,
        fieldsRepository,
        new DummyRobot(),
        robotPredictionStore,
      ),
    [],
  );

  return {
    jotaiStore,
    filesDatabase,
    fileMetadataStore,
    fileSerializer,
    fileStateManager,
    fieldsRepository,
    autosaveStore,
    robotPredictionStore,
    robotPredictor,
  };
}

export const DocMarkerContext = createContext<DocMarkerContextState>(null!);
