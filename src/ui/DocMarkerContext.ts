import { createContext, useMemo } from "react";
import { AutosaveStore, FieldsRepository, FilesDatabase } from "../state";

/**
 * All fields present in the DocMarker's global context
 */
export interface DocMarkerContextState {
  readonly fieldsRepository: FieldsRepository;
  readonly autosaveStore: AutosaveStore;
  readonly filesDatabase: FilesDatabase;
}

/**
 * Creates all services and stores them in the global context
 */
export function useDocMarkerContextState(): DocMarkerContextState {
  const fieldsRepository = useMemo(() => new FieldsRepository(), []);
  const autosaveStore = useMemo(() => new AutosaveStore(), []);
  const filesDatabase = useMemo(() => new FilesDatabase(), []);

  return {
    fieldsRepository,
    autosaveStore,
    filesDatabase,
  };
}

export const DocMarkerContext = createContext<DocMarkerContextState>(null!);
