import { timeoutAsync } from "../utils/timeoutAsync";
import { AnswerPredictionRequest } from "./AnswerPredictionRequest";
import { AnswerPredictionResponse } from "./AnswerPrefictionResponse";
import { Evidence } from "./Evidence";
import { EvidenceExtractionRequest } from "./EvidenceExtractionRequest";
import { EvidenceExtractionResponse } from "./EvidenceExtractionResponse";
import { RobotInterface } from "./RobotInterface";

export class DummyRobot implements RobotInterface {
  /**
   * Extracts a list of evidences for a single form field (a single question)
   */
  public async extractEvidences(
    request: EvidenceExtractionRequest,
    abortSignal: AbortSignal,
  ): Promise<EvidenceExtractionResponse> {
    await timeoutAsync(1_000);

    const generateEvidence = (): Evidence => {
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
   * the set of previously-extracted (or human-provided) evidences
   */
  public async predictAnswer(
    request: AnswerPredictionRequest,
    abortSignal: AbortSignal,
  ): Promise<AnswerPredictionResponse> {
    await timeoutAsync(1_000);

    return {
      answer:
        request.evidences.length > 0 ? request.evidences[0].text : undefined,
      modelVersion: "dummy-answer-model",
      metadata: undefined,
    };
  }
}
