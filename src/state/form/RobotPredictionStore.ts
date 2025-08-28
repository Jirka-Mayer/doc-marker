import { atom, PrimitiveAtom, useAtomValue } from "jotai";
import { AtomGroup } from "../AtomGroup";
import { JotaiStore } from "../JotaiStore";

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
          // fieldId: key,
          isBeingPredicted: false,
          // predictedValue: undefined,
          // isHumanVerified: false,
        }),
      jotaiStore,
    );
  }

  public useFieldPrediction(fieldId: string): FieldPrediction {
    return useAtomValue(this.fieldAtoms.get(fieldId));
  }

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
   * DocMarker field ID of the value that is predicted.
   * (corresponds to the `path` of the value in JSON forms)
   */
  // readonly fieldId: string;

  /**
   * The field is being predicted by the robot.
   * Having this value set to true should display a spinner over the field.
   */
  readonly isBeingPredicted: boolean;

  /**
   * The value that was predicted by the robot
   */
  // readonly predictedValue: any;

  // predicted evidence (es?) (null?)

  /**
   * The user has manually indicated that the prediction is correct.
   */
  // readonly isHumanVerified: boolean;
  // TODO: consider only when the predicted value and evidence matches data?
}
