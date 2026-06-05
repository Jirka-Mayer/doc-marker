import { AnswerPredictionRequest } from "./AnswerPredictionRequest";
import { AnswerPredictionResponse } from "./AnswerPredictionResponse";
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
   * Maximum number of fields that can be sent to this robot interface
   * in parallel. (The maximum number of pending field requests)
   * A field request is one evidence extraction followed by one answer
   * prediction request.
   *
   * If you send requests directly to an API, use 5 as this is the
   * concurrency limit of the browser fetch API. If you do batching,
   * multiply this number accordingly to fill up batches.
   */
  readonly maxFieldRequestConcurrency: number;

  /**
   * Extracts a list of evidences for a single form field (a single question)
   * Aborting should not throw, instead, null should be returned.
   */
  extractEvidences: (
    request: EvidenceExtractionRequest,
    abortSignal: AbortSignal,
  ) => Promise<EvidenceExtractionResponse | null>;

  /**
   * Attempts to predict an anwer for a form field (a question) given
   * the set of previously-extracted (or human-provided) evidences.
   * Aborting should not throw, instead, null should be returned.
   */
  predictAnswer: (
    request: AnswerPredictionRequest,
    abortSignal: AbortSignal,
  ) => Promise<AnswerPredictionResponse | null>;
}
