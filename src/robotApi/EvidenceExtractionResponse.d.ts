import { Evidence } from "./Evidence";

export interface EvidenceExtractionResponse {
  /**
   * List of evidences to be highlighted for the requested field
   */
  readonly evidences: Evidence[];

  /**
   * Version of the robot model that performed the evidence extraction,
   * human-readable, any string.
   */
  readonly modelVersion: string;
}
