export interface AnswerPredictionResponse {
  /**
   * The value for the field that was predicted,
   * undefined means we leave the value unfilled, since the robot is not sure
   */
  readonly answer: any;

  /**
   * Version of the robot model that performed the evidence extraction,
   * human-readable, any string.
   */
  readonly modelVersion: string;

  /**
   * Any metadata that the model may wish to add to the prediction,
   * that will be stored in the serialized JSON file
   */
  readonly metadata: any | undefined;
}
