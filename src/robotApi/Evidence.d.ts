import { EvidenceRange } from "./EvidenceRange";

/**
 * Signle evidence for a question to the robot.
 * An evidence is a single span of text in the report, containing the answer
 * to a field in the form.
 */
export interface Evidence {
  /**
   * The text span that contains the evidence
   */
  readonly range: EvidenceRange;

  /**
   * The text of the range that contains the evidence
   */
  readonly text: string;
}
