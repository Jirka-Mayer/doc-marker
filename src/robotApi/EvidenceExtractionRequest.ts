import { IsoLanguage } from "../IsoLanguage";

export interface EvidenceExtractionRequest {
  /**
   * Plain text content of the source report
   */
  readonly reportText: string;

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
   * ID of the field within the form, which is being asked
   * (Field ID is the dot-separated JSON path through the form data)
   */
  readonly fieldId: string;
}
