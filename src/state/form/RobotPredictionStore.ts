import { atom, PrimitiveAtom, useAtomValue } from "jotai";
import { AtomGroup } from "../AtomGroup";
import { JotaiStore } from "../JotaiStore";
import { Evidence } from "../../robotApi/Evidence";

/**
 * Global service that stores predictions and metadata from automated models,
 * which pre-fill the form for the human user. This data is kept even if the
 * user decides to correct it, so that these corrections can later be analyzed.
 */
export class RobotPredictionStore {
  private readonly jotaiStore: JotaiStore;

  private readonly fieldAtoms: AtomGroup<PrimitiveAtom<FieldPrediction>>;

  constructor(jotaiStore: JotaiStore) {
    this.jotaiStore = jotaiStore;
    this.fieldAtoms = new AtomGroup<PrimitiveAtom<FieldPrediction>>(
      (key: string) =>
        atom({
          isBeingPredicted: false,
          evidences: null,
          predictedValue: undefined,
          isHumanVerified: false,
          evidenceModelVersion: null,
          predictionModelVersion: null,
          evidenceMetadata: undefined,
          predictionMetadata: undefined,
        }),
      jotaiStore,
    );
  }

  /**
   * Provides read-only access to the FieldPrediction value for a given field
   */
  public useFieldPrediction(fieldId: string): FieldPrediction {
    return useAtomValue(this.fieldAtoms.get(fieldId));
  }

  /**
   * Updates the FieldPrediction value for a given field
   * (providing a partial object to overwrite some properties)
   */
  public patchFieldPrediction(
    fieldId: string,
    valuePatch: Partial<FieldPrediction>,
  ) {
    const fieldAtom = this.fieldAtoms.get(fieldId);
    const value = this.jotaiStore.get(fieldAtom);
    this.jotaiStore.set(fieldAtom, {
      ...value,
      ...valuePatch,
    });
  }

  public removeSpinnersFromAllFields() {
    for (const fieldId of this.fieldAtoms.keys()) {
      if (this.jotaiStore.get(this.fieldAtoms.get(fieldId)).isBeingPredicted) {
        this.patchFieldPrediction(fieldId, {
          isBeingPredicted: false,
        });
      }
    }
  }
}

/**
 * Stores data about a prediction for a field
 */
export interface FieldPrediction {
  /**
   * The field is being predicted by the robot.
   * Having this value set to true should display a spinner over the field.
   */
  readonly isBeingPredicted: boolean;

  /**
   * List of evidences (text highlights) that were predicted by the robot.
   * They were also used in the answer prediction as-is. Empty list means
   * the robot predicted no evidences for the field, which does happen for
   * some questions (they are evidence-less). Should the robot provide
   * no prediction (e.g. being too uncertain), then this value is null.
   */
  readonly evidences: Evidence[] | null;

  /**
   * The value returned by the robot as the predicted value of the field.
   * Undefined means the robot did not predict any value (left the field
   * empty, which corresponds to the default value for empty fields).
   * Robot may have not predicted any value because of its low confidence,
   * despite having many evidences extracted previously.
   */
  readonly predictedValue: any | undefined;

  /**
   * Whether the predicted value was manually verified by the human
   * annotator. This value is should be ignored when it makes no sense,
   * e.g. when the predicted value is undefined, evidences are null, or
   * the predicted value does not match the form data for the field
   * (which happens when the user modifies the form data after prediction).
   */
  readonly isHumanVerified: boolean;

  /**
   * Version of the model that was used for evidence extraction,
   * null if no prediction was made yet
   */
  readonly evidenceModelVersion: string | null;

  /**
   * Version of the model that was used for answer prediction,
   * null if no prediction was made yet
   */
  readonly predictionModelVersion: string | null;

  /**
   * Any additional metadata that may be stored, depending on the models
   * used. This depends on the DocMarker customization and the model that
   * it is connected to. May be missing if not set by the robot integration.
   * May also be undefined when the prediction was not made yet.
   */
  readonly evidenceMetadata: any | undefined;

  /**
   * Any additional metadata that may be stored, depending on the models
   * used. This depends on the DocMarker customization and the model that
   * it is connected to. May be missing if not set by the robot integration.
   * May also be undefined when the prediction was not made yet.
   */
  readonly predictionMetadata: any | undefined;
}
