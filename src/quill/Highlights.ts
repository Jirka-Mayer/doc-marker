import { TextRange } from "../utils/TextRange";

/**
 * Data type for a dictionary that lists highlight
 * text ranges for each form field
 */
export interface Highlights {
  [fieldId: string]: TextRange[];
}
