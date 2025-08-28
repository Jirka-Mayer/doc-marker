/**
 * The text range for an evidence
 */
export interface EvidenceRange {
  /**
   * Index of the first character in the report text that belongs to the span
   */
  readonly index: number;

  /**
   * The length of the span in characters
   */
  readonly length: number;
}
