import { ExtractedEvidence } from "./ExtractedEvidence";

export interface EvidenceExtractionResponse {
  /**
   * List of evidences to be highlighted for the requested field,
   * null means the model refuses to predict them,
   * likely due to low confidence.
   */
  readonly evidences: ExtractedEvidence[] | null;

  /**
   * Version of the robot model that performed the evidence extraction,
   * human-readable, any string.
   */
  readonly modelVersion: string;

  /**
   * Any metadata that the model may wish to add to the prediction,
   * that will be stored in the serialized JSON file
   */
  readonly metadata: any | undefined;
}
