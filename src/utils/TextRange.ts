/**
 * The text range for anything - highlight, evidence, selection ...
 */
export interface TextRange {
  /**
   * Index of the first character in the report text that belongs to the span
   */
  readonly index: number;

  /**
   * The length of the span in characters
   */
  readonly length: number;
}
