import { atom, PrimitiveAtom, useAtomValue } from "jotai";
import { AtomGroup } from "../AtomGroup";
import { JotaiStore } from "../JotaiStore";
import { ExtractedEvidence } from "../../robotApi/ExtractedEvidence";
import { TextRange } from "../../utils/TextRange";
import {
  quillExtended,
  textAtom,
  getFieldHighlightsAtom,
} from "../reportStore";
import { useMemo } from "react";
import { FieldsRepository } from "./FieldsRepository";
import { ISignal, SignalDispatcher } from "strongly-typed-events";

/**
 * Global service that stores predictions and metadata from automated models,
 * which pre-fill the form for the human user. This data is kept even if the
 * user decides to correct it, so that these corrections can later be analyzed.
 */
export class RobotPredictionStore {
  private readonly jotaiStore: JotaiStore;
  private readonly fieldsRepository: FieldsRepository;

  /**
   * Atoms that hold the raw robot prediction. If no prediction was made
   * for the field, than the value is null.
   */
  private readonly robotPredictionAtoms: AtomGroup<
    PrimitiveAtom<RobotPrediction | null>
  >;

  private readonly predictionStateAtoms: AtomGroup<
    PrimitiveAtom<PredictionState>
  >;

  constructor(jotaiStore: JotaiStore, fieldsRepository: FieldsRepository) {
    this.jotaiStore = jotaiStore;
    this.fieldsRepository = fieldsRepository;

    this.robotPredictionAtoms = new AtomGroup<
      PrimitiveAtom<RobotPrediction | null>
    >((key: string) => atom(null), jotaiStore);

    this.predictionStateAtoms = new AtomGroup<PrimitiveAtom<PredictionState>>(
      (key: string) =>
        atom({
          isBeingPredicted: false,
          isHumanVerified: false,
        }),
      jotaiStore,
    );
  }

  /**
   * Returns field IDs that have robot prediction and are currently visible
   * in the form
   */
  public getPredictedVisibleFieldIds(): string[] {
    return this.robotPredictionAtoms
      .keys()
      .filter((fieldId) => {
        const r = this.jotaiStore.get(this.robotPredictionAtoms.get(fieldId));
        if (r === null) {
          return false; // has no prediction
        }
        if (this.fieldsRepository.fields.get(fieldId)?.visible !== true) {
          return false; // is not visible
        }
        return true;
      })
      .sort();
  }

  /**
   * Fuses the raw robot prediction and the in-memory prediction state
   * into one object, extended with computed values, that can be easily
   * consumed by the user in a read-only fashion.
   */
  private constructFieldPrediction(
    robot: RobotPrediction | null,
    state: PredictionState,
    reportText: string,
    fieldHighlights: TextRange[],
    fieldFormData: any,
  ): FieldPrediction {
    if (robot === null) {
      return {
        isBeingPredicted: state.isBeingPredicted,
        robot: null,
        evidencesMatchHighlights: null,
        answerMatchesFormData: null,
        wholePredictionMatchesData: null,
        isHumanVerified: null,
      };
    }

    // text-only comparison, since the ranges may have been moved
    // or even shuffled since the prediction was made
    let evidencesMatchHighlights: boolean = true;
    if (robot.evidences.length === fieldHighlights.length) {
      const evidenceTexts = robot.evidences.map((e) => e.text).sort();
      const highlightTexts = fieldHighlights
        .map((h) => reportText.substring(h.index, h.index + h.length))
        .sort();
      for (let i = 0; i < robot.evidences.length; i++) {
        if (evidenceTexts[i] !== highlightTexts[i]) {
          evidencesMatchHighlights = false;
          break;
        }
      }
    } else {
      evidencesMatchHighlights = false;
    }

    // if the answer exists, compare it
    const answerMatchesFormData: boolean | null =
      robot.answer === undefined ? null : robot.answer === fieldFormData;

    // only makes sense when both sub-values make sense
    // (evidences make always sense in this code branch, but whatever...)
    const wholePredictionMatchesData: boolean | null =
      answerMatchesFormData === null || evidencesMatchHighlights === null
        ? null
        : evidencesMatchHighlights && answerMatchesFormData;

    // only makes sense when robot answer exists (which implies evidences
    // existing) and that answer matches form data
    // and evidence matches highlights
    let isHumanVerified: boolean | null =
      wholePredictionMatchesData === true ? state.isHumanVerified : null;

    return {
      isBeingPredicted: state.isBeingPredicted,
      robot: robot,
      evidencesMatchHighlights: evidencesMatchHighlights,
      answerMatchesFormData: answerMatchesFormData,
      wholePredictionMatchesData: wholePredictionMatchesData,
      isHumanVerified: isHumanVerified,
    };
  }

  /**
   * Reads the current prediction state for the given field
   */
  public getFieldPrediction(fieldId: string): FieldPrediction {
    const robot = this.jotaiStore.get(this.robotPredictionAtoms.get(fieldId));
    const state = this.jotaiStore.get(this.predictionStateAtoms.get(fieldId));
    const reportText = quillExtended.getText();
    const fieldHighlights: TextRange[] = this.jotaiStore.get(
      getFieldHighlightsAtom(fieldId),
    );
    const fieldData = this.fieldsRepository.fields.get(fieldId)?.data;

    return this.constructFieldPrediction(
      robot,
      state,
      reportText,
      fieldHighlights,
      fieldData,
    );
  }

  /**
   * Provides read-only access to the FieldPrediction value for a given field
   */
  public useFieldPrediction(fieldId: string, fieldData: any): FieldPrediction {
    const robot = useAtomValue(this.robotPredictionAtoms.get(fieldId));
    const state = useAtomValue(this.predictionStateAtoms.get(fieldId));
    const reportText = useAtomValue(textAtom);
    const fieldHighlights: TextRange[] = useAtomValue(
      getFieldHighlightsAtom(fieldId),
    );

    return useMemo(
      () =>
        this.constructFieldPrediction(
          robot,
          state,
          reportText,
          fieldHighlights,
          fieldData,
        ),
      [robot, state, reportText, fieldHighlights, fieldData],
    );
  }

  ////////////////////////////
  // State Mutation Actions //
  ////////////////////////////

  /**
   * Called by the robot predictor to set the raw robot prediction.
   */
  public setRobotPrediction(
    fieldId: string,
    robotPrediction: RobotPrediction,
  ): void {
    this.jotaiStore.set(
      this.robotPredictionAtoms.get(fieldId),
      robotPrediction,
    );
    this.patchPredictionState(fieldId, (s) => ({
      ...s,
      isBeingPredicted: false,
    }));

    // raise event
    this._onHistoryTrackedStateChange.dispatch();
  }

  /**
   * Removes robot prediction is one is stored
   */
  public eraseRobotPrediction(fieldId: string): void {
    this.jotaiStore.set(this.robotPredictionAtoms.get(fieldId), null);

    // raise event
    this._onHistoryTrackedStateChange.dispatch();
  }

  /**
   * Helper function that modifies the prediction state for a given field,
   * by providing a patcher function
   */
  private patchPredictionState(
    fieldId: string,
    patcher: (oldState: PredictionState) => PredictionState,
  ): void {
    const stateAtom = this.predictionStateAtoms.get(fieldId);
    const oldState = this.jotaiStore.get(stateAtom);
    this.jotaiStore.set(stateAtom, patcher(oldState));
  }

  /**
   * Sets the isBeingPredicted to true on the given field
   */
  public showSpinnerOnField(fieldId: string): void {
    this.patchPredictionState(fieldId, (s) => ({
      ...s,
      isBeingPredicted: true,
    }));

    // No event: This state is not important to undo/redo
  }

  /**
   * Sets the isBeingPredicted to false on the given field
   */
  public hideSpinnerOnField(fieldId: string) {
    this.patchPredictionState(fieldId, (s) => ({
      ...s,
      isBeingPredicted: false,
    }));

    // No event: This state is not important to undo/redo
  }

  /**
   * Sets the isBeingPredicted to false on all fields
   */
  public hideSpinnersOnAllFields() {
    for (const fieldId of this.predictionStateAtoms.keys()) {
      const stateAtom = this.predictionStateAtoms.get(fieldId);
      const state = this.jotaiStore.get(stateAtom);
      if (state.isBeingPredicted) {
        this.jotaiStore.set(stateAtom, {
          ...state,
          isBeingPredicted: false,
        });
      }
    }

    // No event: This state is not important to undo/redo
  }

  /**
   * Updates the FieldPrediction value for a given field
   * (providing a partial object to overwrite some properties)
   */
  public toggleIsHumanVerified(fieldId: string) {
    this.patchPredictionState(fieldId, (s) => ({
      ...s,
      isHumanVerified: !s.isHumanVerified,
    }));

    // raise event
    this._onHistoryTrackedStateChange.dispatch();
  }

  /**
   * Removes all robot-predicted as well as user-provided data
   * for all fields, effectively erasing the contents of this store.
   */
  public eraseAllPredictionData(): void {
    for (const fieldId of this.predictionStateAtoms.keys()) {
      const stateAtom = this.predictionStateAtoms.get(fieldId);
      this.jotaiStore.set(stateAtom, {
        isBeingPredicted: false,
        isHumanVerified: false,
      });
    }
    for (const fieldId of this.robotPredictionAtoms.keys()) {
      const robotAtom = this.robotPredictionAtoms.get(fieldId);
      this.jotaiStore.set(robotAtom, null);
    }

    // raise event
    this._onHistoryTrackedStateChange.dispatch();
  }

  ///////////////////////////////
  // Serialization and History //
  ///////////////////////////////

  /**
   * Called by the file serializer when a file is being loaded
   */
  public loadDeserializedStateForField(
    fieldId: string,
    robotPrediction: RobotPrediction,
    predictionState: PredictionState,
  ): void {
    this.jotaiStore.set(
      this.robotPredictionAtoms.get(fieldId),
      robotPrediction,
    );
    this.jotaiStore.set(
      this.predictionStateAtoms.get(fieldId),
      predictionState,
    );
  }

  /**
   * Returns a state snapshot of this state to be stored in history (undo/redo)
   */
  public getHistorySnapshotState(): RpsHistorySnapshotState {
    const preds: RpsHistorySnapshotState = {};
    for (const fieldId of this.robotPredictionAtoms.keys()) {
      const r = this.jotaiStore.get(this.robotPredictionAtoms.get(fieldId));
      const p = this.jotaiStore.get(this.predictionStateAtoms.get(fieldId));
      preds[fieldId] = {
        robotPrediction: r,
        predictionState: {
          isHumanVerified: p.isHumanVerified,
        },
      };
    }
    return preds;
  }

  /**
   * Resotres this store's state from a history snapshot (on undo/redo)
   */
  public restoreFromHistorySnapshotState(state: RpsHistorySnapshotState): void {
    for (const fieldId of Object.keys(state)) {
      this.jotaiStore.set(
        this.robotPredictionAtoms.get(fieldId),
        state[fieldId].robotPrediction,
      );

      const p = this.jotaiStore.get(this.predictionStateAtoms.get(fieldId));
      this.jotaiStore.set(this.predictionStateAtoms.get(fieldId), {
        ...p,
        ...state[fieldId].predictionState,
      });
    }
  }

  ////////////
  // Events //
  ////////////

  private _onHistoryTrackedStateChange = new SignalDispatcher();

  /**
   * Event that fires whenever the state tracked by history changes
   * (so almost everything except isBeingPredicted and similar runtime-only
   * state)
   */
  public get onHistoryTrakcedStateChange(): ISignal {
    return this._onHistoryTrackedStateChange.asEvent();
  }
}

/**
 * Defines all data that is exported from this store for users to read.
 * It is a combination of the robot prediction and prediction state,
 * extended with a number of deterministicaly computed values.
 */
export interface FieldPrediction {
  /**
   * The field is being predicted by the robot.
   * Having this value set to true should display a spinner over the field.
   */
  readonly isBeingPredicted: boolean;

  /**
   * Holds the raw predictions by the robot. If there is no robot prediction,
   * then this field is null.
   */
  readonly robot: RobotPrediction | null;

  /**
   * True if the highlights for this field exactly match the evidences
   * for this field. It only considers text equality, not range equality, since
   * the report may have been modified and the ranges may have been shifted.
   * In other words, true means that extracted evidences were not modified
   * by the user and the report text has not beed modified within these ranges
   * either. This value is null if there is no robot prediction for evidences
   * (and this it makes no sense).
   */
  readonly evidencesMatchHighlights: boolean | null;

  /**
   * True when the predicted value matches data in the form. This means
   * the user has not modified the predicted data and so it's either
   * the correct prediction, or has not yet been verified (depending on
   * the isHumanVerified value). This value is null if there is no
   * predicted answer by the robot (and thus it makes no sense).
   */
  readonly answerMatchesFormData: boolean | null;

  /**
   * True if both the highlights and the answer perfectly match the report
   * text and the form data. In other words, the prediction by the robot was
   * not modified by the user in the slightest. If there is no robot prediction
   * or no robot answer, then this field is null (because it makes no sense).
   */
  readonly wholePredictionMatchesData: boolean | null;

  /**
   * Whether the predicted value was manually verified by the human
   * annotator. This value is null when it makes no sense,
   * e.g. when the predicted value is undefined, robot prediction is null, or
   * the predicted value does not match the form data for the field
   * (which happens when the user modifies the form data after prediction).
   */
  readonly isHumanVerified: boolean | null;
}

/**
 * Holds the raw data, that was predicted by the robot.
 * This does not change, unless the robot is re-run or this data is erased.
 */
export interface RobotPrediction {
  /**
   * List of evidences (text highlights) that were predicted by the robot.
   * They were also used in the answer prediction as-is. Empty list means
   * the robot predicted no evidences for the field, which does happen for
   * some questions (they are evidence-less). Should the robot provide
   * no prediction (e.g. being too uncertain), then this whole robot
   * prediction object for this field would be missing instead,
   * since without evidences the value cannot be predicted.
   */
  readonly evidences: ExtractedEvidence[];

  /**
   * The value returned by the robot as the predicted value of the field.
   * Undefined means the robot did not predict any value (left the field
   * empty, which corresponds to the default value for empty fields).
   * Robot may have not predicted any value because of its low confidence,
   * despite having many evidences extracted previously.
   */
  readonly answer: any | undefined;

  /**
   * Version of the model that was used for evidence extraction.
   */
  readonly evidenceModelVersion: string;

  /**
   * Version of the model that was used for answer prediction.
   */
  readonly predictionModelVersion: string;

  /**
   * Any additional metadata that may be stored, depending on the models
   * used. This depends on the DocMarker customization and the model that
   * it is connected to. May be missing if not set by the robot integration.
   */
  readonly evidenceMetadata: any | undefined;

  /**
   * Any additional metadata that may be stored, depending on the models
   * used. This depends on the DocMarker customization and the model that
   * it is connected to. May be missing if not set by the robot integration.
   */
  readonly predictionMetadata: any | undefined;
}

/**
 * Holds prediction state that is not predicted by the robot and is
 * either runtime-only or is explicitly annotated by the user
 */
export interface PredictionState {
  /**
   * The field is being predicted by the robot.
   * Having this value set to true should display a spinner over the field.
   */
  readonly isBeingPredicted: boolean;

  /**
   * Whether the predicted value was manually verified by the human
   * annotator. This value should be ignored when it makes no sense,
   * e.g. when the predicted value is undefined, robot prediction is null, or
   * the predicted value does not match the form data for the field
   * (which happens when the user modifies the form data after prediction).
   */
  readonly isHumanVerified: boolean;
}

/**
 * Data that is persisted in history snapshots (undo/redo)
 */
export interface RpsHistorySnapshotState {
  // for each field
  [fieldId: string]: {
    // store the robot prediction, which is an atomic unit
    readonly robotPrediction: RobotPrediction | null;

    // and store parts of the in-memory prediction state,
    // which should be tracked via history
    // (i.e. isBeingPredicted does not need (and in fact shouldn't be) stored)
    readonly predictionState: {
      readonly isHumanVerified: boolean;
    };
  };
}
