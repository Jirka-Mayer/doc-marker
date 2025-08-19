import { Atom, atom, PrimitiveAtom } from "jotai";
import { JotaiStore } from "./JotaiStore";
import { FieldsRepository } from "./form/FieldsRepository";
import { timeoutAsync } from "../utils/timeoutAsync";
import { SemaphoreAsync } from "../utils/SemaphoreAsync";

/**
 * Maximum number of API requests allowed to run in parallel
 */
export const MAX_ROBOT_API_CONCURRENCY = 5;

/**
 * This service is responsible for orchestrating the top-level robot
 * prediction logic. When the user interacts with the UI, this service
 * is being interacted with.
 */
export class RobotPredictor {
  private readonly jotaiStore: JotaiStore;
  private readonly fieldsRepository: FieldsRepository;

  constructor(jotaiStore: JotaiStore, fieldsRepository: FieldsRepository) {
    this.jotaiStore = jotaiStore;
    this.fieldsRepository = fieldsRepository;
  }

  //////////////////////////////
  // Top-level start/stop API //
  //////////////////////////////

  /**
   * Atom is true, when the robot prediction is in progress (for any fields)
   */
  public readonly isPredictionRunningAtom: Atom<boolean> = atom((get) =>
    get(this.isPredictionRunningBaseAtom),
  );

  private readonly isPredictionRunningBaseAtom: PrimitiveAtom<boolean> =
    atom(false);

  /**
   * Returns true when the robot prediction is in progress (for any fields)
   */
  public get isPredictionRunning(): boolean {
    return this.jotaiStore.get(this.isPredictionRunningAtom);
  }

  /**
   * Signals aborting to per-field prediction promises
   */
  private abortController: AbortController | null = null;

  /**
   * Returns true if we should abort all prediction logic
   */
  private get isAborted(): boolean {
    if (this.abortController === null) return true;
    return this.abortController.signal.aborted;
  }

  /**
   * List of field IDs that should be predicted by the algorithm,
   * reduced as the algorithm runs.
   */
  private fieldIdsToBePredicted: string[] | null = null;

  /**
   * Stops the current prediction, if running, else does nothing.
   */
  public abortPrediction(): void {
    if (!this.isPredictionRunning) {
      return;
    }
    this.abortController?.abort();
  }

  /**
   * Starts a prediction on the provided set of fields. If omitted, all form
   * fields are consiconsidered. Not all of the provided fields may be
   * predicted, because they may remain invisible or are already filled-out
   * by the user. In that case the algorithm finishes, when there are no more
   * fields to be predicted from within this set.
   */
  public startPrediction(fieldIdsToBePredicted: string[] | null = null): void {
    // make sure no prediction is running
    if (this.isPredictionRunning) {
      throw new Error(
        "Cannot start new prediction, there is one running already.",
      );
    }

    // resolve the full list of field IDs, if null was provided
    const formFieldIds = new Set<string>(this.fieldsRepository.fields.keys());
    if (fieldIdsToBePredicted === null) {
      fieldIdsToBePredicted = [...formFieldIds];
    }

    // throw away field IDs that do not exist in the form
    fieldIdsToBePredicted = fieldIdsToBePredicted.filter((fid) =>
      formFieldIds.has(fid),
    );

    // <- Here we could ensure the fieldId ordering to be aligned with
    // the form itself. But since the FieldsRepository is updated from the
    // react components, rendered in that order, we should get the proper
    // order without doing anything ourselves here.

    // fire off the prediction loop
    this.fieldIdsToBePredicted = fieldIdsToBePredicted;
    this.predictionLoop(); // no await on purpose
  }

  /////////////////////////
  // The prediction loop //
  /////////////////////////

  /**
   * Statistic: The number of fields that have been predicted in this run
   */
  public finishedFieldCountAtom: PrimitiveAtom<number> = atom(0);

  /**
   * Statistic: The number of fields that are to be predicted in total
   * (the number of started predictions, can increase as fields become visible)
   */
  public attemptedFieldCountAtom: PrimitiveAtom<number> = atom(0);

  /**
   * This method runs until the prediction completes
   * (or all the promises are aborted, which results in their completion)
   */
  private async predictionLoop(): Promise<void> {
    // start the prediction
    this.abortController = new AbortController();
    this.jotaiStore.set(this.isPredictionRunningBaseAtom, true);
    this.jotaiStore.set(this.finishedFieldCountAtom, 0);
    this.jotaiStore.set(this.attemptedFieldCountAtom, 0);

    // the loop
    let runningFieldPredictions = new Map<string, Promise<string>>();
    while (true) {
      // start all predictions that can be started
      const newlyStartedPredictions = this.startAllAvailableFieldPredictions();
      for (const [fid, pred] of newlyStartedPredictions) {
        runningFieldPredictions.set(fid, pred);
      }

      // primary loop termination: either nothing to do, or aborting
      if (runningFieldPredictions.size === 0 || this.isAborted) {
        break;
      }

      // update the attempted fields statistic
      this.jotaiStore.set(
        this.attemptedFieldCountAtom,
        this.jotaiStore.get(this.attemptedFieldCountAtom) +
          newlyStartedPredictions.length,
      );

      // wait for one prediction to finish and remove it
      const winnerFieldId = await Promise.race(
        runningFieldPredictions.values(),
      );
      runningFieldPredictions.delete(winnerFieldId);

      // secondary loop termination: aborting
      // (prevents statistics update during aborting)
      if (this.isAborted) {
        break;
      }

      // update the finished fields statistic
      this.jotaiStore.set(
        this.finishedFieldCountAtom,
        this.jotaiStore.get(this.finishedFieldCountAtom) + 1,
      );

      // The prediction has applied its values to the form data,
      // but it takes some time for react to re-render and update
      // visibility of all fields. We will wait a little, before we
      // try running new predictions, to make sure we see latest values.
      await timeoutAsync(50); // 50ms
    }

    // end the prediction
    this.jotaiStore.set(this.isPredictionRunningBaseAtom, false);
    this.abortController = null;
  }

  /**
   * Starts per-field predictions for all fields that can be predicted
   * (i.e. are empty and visible) and returns running promises for them.
   * @returns A two-item tuple with the field ID and the promise, the promise
   * returns its field ID when it completes
   */
  private startAllAvailableFieldPredictions(): [string, Promise<string>][] {
    const predictions: [string, Promise<string>][] = [];

    while (true) {
      const prediction = this.tryStartOneAvailableFieldPrediction();

      if (prediction === null) {
        break;
      }

      predictions.push(prediction);
    }

    return predictions;
  }

  /**
   * Goes through the list of fields to predict and tries to find one
   * available field to be predicted. If found, its prediction is
   * started and the promise returned. If not, null is returned instead.
   */
  private tryStartOneAvailableFieldPrediction():
    | [string, Promise<string>]
    | null {
    // this property should only be null when prediction is not running,
    // in which case there is no prediction to be started
    if (this.fieldIdsToBePredicted === null) {
      return null;
    }

    // there are no more fields to predict
    if (this.fieldIdsToBePredicted.length === 0) {
      return null;
    }

    // go through the fields and see which one is available
    for (const fieldId of this.fieldIdsToBePredicted) {
      const field = this.fieldsRepository.fields.get(fieldId);

      // the field must exist in the form
      if (field === undefined) {
        continue;
      }

      // the field must be empty
      // (we don't want to overwirte user's values)
      if (field.data !== undefined) {
        continue;
      }

      // the field must be visible
      // (we don't want to waste time predicting irrelevant fields)
      if (!field.visible) {
        continue;
      }

      // The field is available!

      // remove the field from the prediction list
      this.fieldIdsToBePredicted = this.fieldIdsToBePredicted.filter(
        (fid) => fid !== fieldId,
      );

      // start the prediction and return the tuple,
      // (wrap the promise in an outer promise that returns the fieldId,
      // which is necessary for the Promise.race logic in the main loop)
      return [fieldId, this.singleFieldPrediction(fieldId).then(() => fieldId)];
    }

    // no available field was found
    return null;
  }

  //////////////////////////
  // Per-field prediction //
  //////////////////////////

  /**
   * Limits API requesting concurrency
   */
  private readonly semaphore = new SemaphoreAsync(MAX_ROBOT_API_CONCURRENCY);

  /**
   * Runs robot prediction on a single form field
   * @param fieldId The field to run the prediction on
   */
  private async singleFieldPrediction(fieldId: string): Promise<void> {
    await this.semaphore.criticalSection(async () => {
      // exit if aborting
      if (this.isAborted) {
        return; // only from the semaphore block!
      }

      console.log("Starting prediction for", fieldId);

      // Dummy work done here.
      await timeoutAsync(2_000);
    });

    // exit if aborting
    if (this.isAborted) {
      return;
    }

    // Dummy value set here
    const dummyValue = fieldId;
    this.fieldsRepository.setFieldValue(fieldId, dummyValue);
    // TODO: fields must accept the provided value more gently and coerce
    // it into its own data format, otherwise things break terribly

    console.log("Setting value for", fieldId);

    // TODO: this is how highlights are set:
    // const rangeIndex = 2;
    // const rangeLength = 9;
    // import { quillExtended } from "../reportStore";
    // quillExtended.highlightText(rangeIndex, rangeLength, fieldId);
  }
}
