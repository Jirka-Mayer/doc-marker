import { TextRange } from "../utils/TextRange";

/**
 * Signle evidence for a question to the robot.
 * An evidence is a single span of text in the report, containing the answer
 * to a field in the form.
 */
export interface ExtractedEvidence {
  /**
   * The text span that contains the evidence
   */
  readonly range: TextRange;

  /**
   * The text of the range that contains the evidence
   */
  readonly text: string;
}
