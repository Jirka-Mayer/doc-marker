/**
 * Text range object as defined by the Quill editor
 */
export interface QRange {
  /**
   * Index of the first text character within the range (zero-based)
   */
  index: number;

  /**
   * Number of text characters within the text range
   */
  length: number;
}
