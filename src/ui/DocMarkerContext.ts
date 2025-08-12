import { createContext, useMemo } from "react";
import { FieldsRepository } from "../state";

/**
 * All fields present in the DocMarker's global context
 */
export interface DocMarkerContextState {
  readonly fieldsRepository: FieldsRepository;
}

/**
 * Creates all services and stores them in the global context
 */
export function useDocMarkerContextState(): DocMarkerContextState {
  const fieldsRepository = useMemo(() => new FieldsRepository(), []);

  return {
    fieldsRepository,
  };
}

export const DocMarkerContext = createContext<DocMarkerContextState>(null!);
