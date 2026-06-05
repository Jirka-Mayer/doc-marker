import { IsoLanguage } from "../../IsoLanguage";
import { ExtractedEvidence } from "../ExtractedEvidence";

export interface AnswerPredictionBatchRequest {
  /**
   * Language of the report
   */
  readonly reportLanguage: IsoLanguage;

  /**
   * ID of the form for which the question is being asked
   * (ID within the doc marker's forms)
   */
  readonly formId: string;

  /**
   * Questions for individual fields and coresponding evidences
   */
  readonly questions: FieldQuestion[];
}

export interface FieldQuestion {
  /**
   * ID of the field within the form, which is being asked
   * (Field ID is the dot-separated JSON path through the form data)
   */
  readonly fieldId: string;

  /**
   * List of evidences for the question
   */
  readonly evidences: ExtractedEvidence[];
}
