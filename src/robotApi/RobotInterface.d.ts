import { AnswerPredictionRequest } from "./AnswerPredictionRequest";
import { AnswerPredictionResponse } from "./AnswerPrefictionResponse";
import { EvidenceExtractionRequest } from "./EvidenceExtractionRequest";
import { EvidenceExtractionResponse } from "./EvidenceExtractionResponse";

/**
 * Robot is some external ML system, typically behind an API, that can
 * automatically pre-fill the form from the unstructured text report.
 * This interface defines the boundary between DocMarker and such a robot.
 * The format returned by the robot is inspired by the emrQA dataset format,
 * as well as the SQuAD format.
 */
export interface RobotInterface {
  /**
   * Extracts a list of evidences for a single form field (a single question)
   */
  extractEvidences: (
    request: EvidenceExtractionRequest,
    abortSignal: AbortSignal,
  ) => Promise<EvidenceExtractionResponse>;

  /**
   * Attempts to predict an anwer for a form field (a question) given
   * the set of previously-extracted (or human-provided) evidences
   */
  predictAnswer: (
    request: AnswerPredictionRequest,
    abortSignal: AbortSignal,
  ) => Promise<AnswerPredictionResponse>;
}
