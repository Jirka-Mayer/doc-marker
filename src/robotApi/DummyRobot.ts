import { timeoutAsync } from "../utils/timeoutAsync";
import { AnswerPredictionRequest } from "./AnswerPredictionRequest";
import { AnswerPredictionResponse } from "./AnswerPredictionResponse";
import { ExtractedEvidence } from "./ExtractedEvidence";
import { EvidenceExtractionRequest } from "./EvidenceExtractionRequest";
import { EvidenceExtractionResponse } from "./EvidenceExtractionResponse";
import { RobotInterface } from "./RobotInterface";

export class DummyRobot implements RobotInterface {
  /**
   * Process at most 5 fields at a time (in parallel)
   */
  public readonly maxFieldRequestConcurrency: number = 5;

  /**
   * Extracts a list of evidences for a single form field (a single question)
   * Aborting should not throw, instead, null should be returned.
   */
  public async extractEvidences(
    request: EvidenceExtractionRequest,
    abortSignal: AbortSignal,
  ): Promise<EvidenceExtractionResponse | null> {
    await timeoutAsync(1_000);

    // simulate aborting
    if (abortSignal.aborted) {
      return null;
    }

    const generateEvidence = (): ExtractedEvidence => {
      const length = Math.ceil(5 + Math.random() * 45);
      const index = Math.round(
        Math.random() * (request.reportText.length - length),
      );
      return {
        text: request.reportText.substring(index, index + length),
        range: { index, length },
      };
    };

    const N = Math.round(Math.random() * 2);
    const evidences = [...Array(N).keys()].map((_) => generateEvidence());
    return {
      evidences: Math.random() < 0.1 ? null : evidences,
      modelVersion: "dummy-evidence-model",
      metadata: undefined,
    };
  }

  /**
   * Attempts to predict an anwer for a form field (a question) given
   * the set of previously-extracted (or human-provided) evidences.
   * Aborting should not throw, instead, null should be returned.
   */
  public async predictAnswer(
    request: AnswerPredictionRequest,
    abortSignal: AbortSignal,
  ): Promise<AnswerPredictionResponse | null> {
    await timeoutAsync(1_000);

    // simulate aborting
    if (abortSignal.aborted) {
      return null;
    }

    return {
      answer:
        request.evidences.length > 0 ? request.evidences[0].text : undefined,
      modelVersion: "dummy-answer-model",
      metadata: undefined,
    };
  }
}
