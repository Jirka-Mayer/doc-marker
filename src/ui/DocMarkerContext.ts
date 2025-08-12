import { createContext, useMemo } from "react";
import { AutosaveStore, FieldsRepository } from "../state";

/**
 * All fields present in the DocMarker's global context
 */
export interface DocMarkerContextState {
  readonly fieldsRepository: FieldsRepository;
  readonly autosaveStore: AutosaveStore;
}

/**
 * Creates all services and stores them in the global context
 */
export function useDocMarkerContextState(): DocMarkerContextState {
  const fieldsRepository = useMemo(() => new FieldsRepository(), []);
  const autosaveStore = useMemo(() => new AutosaveStore(), []);

  return {
    fieldsRepository,
    autosaveStore,
  };
}

export const DocMarkerContext = createContext<DocMarkerContextState>(null!);
