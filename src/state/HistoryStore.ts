import { Atom, atom, PrimitiveAtom } from "jotai";
import * as formStore from "./formStore";
import * as reportStore from "./reportStore";
import * as editorStore from "./editorStore";
import { JotaiStore } from "./JotaiStore";
import { QDelta } from "../quill/QDelta";
import { IsoLanguage } from "../IsoLanguage";
import { TextRange } from "../utils/TextRange";
import { AppMode } from "./editor/AppMode";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";

/**
 * Maximum number of items in the history stack
 */
const MAX_STACK_SIZE = 100;

/**
 * When changes come faster than this time span, they are merged into a single
 * history snapshot to prevent flooding the history stack.
 */
const DEBOUNCE_TIME_MS = 1000;

/**
 * Set to true when developing the app and debugging the behaviour
 * of this service. It enables verbose console logging.
 */
const DEBUG = false;

function debugLog(...args) {
  if (!DEBUG) return;
  console.log("[HistoryStore]:", ...args);
}

/**
 * Stores snapshots of application state and provides functionality to go
 * back in time to restore previous versions. Works by observing changes
 * to the state and when they occur, it creates a HistorySnapshot.
 * It debounces changes that are too close together (by replacing the
 * latest snapshot) to prevent history stack flooding during fast changes,
 * such as user typing text, or an automatic action performing many
 * modificaitons in quick succession. Taking a snapshot should be fast,
 * as it happens very often (with each state change). It should consist
 * of just reading already existing value, not computing any additional ones.
 *
 * Inspired by: https://quilljs.com/docs/modules/history/
 */
export class HistoryStore {
  private jotaiStore: JotaiStore;

  constructor(jotaiStore: JotaiStore) {
    this.jotaiStore = jotaiStore;

    this.startObservingApplication();
  }

  ///////////////////
  // History Stack //
  ///////////////////

  /**
   * History stack is a list of history snapshots, where new ones are appended
   */
  private readonly stackAtom: PrimitiveAtom<HistorySnapshot[]> = atom([
    this.createEmptySnapshot(),
  ]);

  private get stack(): HistorySnapshot[] {
    return this.jotaiStore.get(this.stackAtom);
  }

  private set stack(value: HistorySnapshot[]) {
    this.jotaiStore.set(this.stackAtom, value);
  }

  /**
   * Pointer to the current position in the history stack
   * (usually the latest snapshot, unless we did undo)
   */
  private readonly stackPointerAtom: PrimitiveAtom<number> = atom(0);

  private get stackPointer(): number {
    return this.jotaiStore.get(this.stackPointerAtom);
  }

  private set stackPointer(value: number) {
    this.jotaiStore.set(this.stackPointerAtom, value);
  }

  /**
   * True if the undo operation can be performed
   */
  public readonly canUndoAtom: Atom<boolean> = atom((get) => {
    const stackPointer = get(this.stackPointerAtom);
    const stack = get(this.stackAtom);
    return stackPointer > 0 && stack.length > 0 && stackPointer < stack.length;
  });

  public get canUndo(): boolean {
    return this.jotaiStore.get(this.canUndoAtom);
  }

  /**
   * True if the redo operation can be performed
   */
  public readonly canRedoAtom: Atom<boolean> = atom((get) => {
    const stackPointer = get(this.stackPointerAtom);
    const stack = get(this.stackAtom);
    return stackPointer < stack.length - 1;
  });

  public get canRedo(): boolean {
    return this.jotaiStore.get(this.canRedoAtom);
  }

  /**
   * Takes one step back in the history stack and restores the older state
   * (does nothing if we can't go back any further)
   */
  public performUndo(): void {
    if (!this.canUndo) {
      return;
    }

    const newerSnapshot = this.stack[this.stackPointer];

    // undo
    this.stackPointer -= 1;
    const olderSnapshot = this.stack[this.stackPointer];
    this.restoreSnapshot(olderSnapshot);

    debugLog(`Did UNDO`, this.stackPointer, this.stack);

    // emit event
    this._onApplicationStateChange.dispatch({
      changeKind: "undo",
      fromSnapshot: newerSnapshot,
      toSnapshot: olderSnapshot,
      isCosmeticChange: newerSnapshot.isCosmeticChange,
    });
  }

  /**
   * Takes one step forward on the history stack and restores the newer state
   * (does nothing if we can't go forward any further)
   */
  public performRedo(): void {
    if (!this.canRedo) {
      return;
    }

    const olderSnapshot = this.stack[this.stackPointer];

    // redo
    this.stackPointer += 1;
    const newerSnapshot = this.stack[this.stackPointer];
    this.restoreSnapshot(newerSnapshot);

    debugLog(`Did REDO`, this.stackPointer, this.stack);

    // emit event
    this._onApplicationStateChange.dispatch({
      changeKind: "redo",
      fromSnapshot: olderSnapshot,
      toSnapshot: newerSnapshot,
      isCosmeticChange: newerSnapshot.isCosmeticChange,
    });
  }

  /**
   * Clears the history stack to empty
   */
  public clear(): void {
    const clearedSnapshot = this.takeSnapshot("clearHistory", false);

    const previousSnapshot = this.stack[this.stackPointer];

    this.stack = [clearedSnapshot];
    this.stackPointer = 0;

    debugLog(`Cleared the history stack:`, this.stackPointer, this.stack);

    // emit event
    this._onApplicationStateChange.dispatch({
      changeKind: "clear",
      fromSnapshot: previousSnapshot,
      toSnapshot: clearedSnapshot,
      isCosmeticChange: false,
    });
  }

  //////////////////
  // Snapshotting //
  //////////////////

  /**
   * Takes a history snapshot and returns its instance
   * (does not interact with the history stack)
   */
  private takeSnapshot(
    eventName: string,
    isCosmeticChange: boolean,
  ): HistorySnapshot {
    const snapshot: HistorySnapshot = {
      eventName: eventName,
      isCosmeticChange: isCosmeticChange,
      takenAt: new Date(),
      // making a copy helps bust react caching and force re-renders on undo/redo
      formData: { ...this.jotaiStore.get(formStore.formDataAtom) },
      reportDelta: this.jotaiStore.get(reportStore.contentAtom),
      reportLanguage: this.jotaiStore.get(reportStore.reportLanguageAtom),
      reportSelection: reportStore.quillExtended.getSelection(),
      appMode: this.jotaiStore.get(editorStore.appModeAtom),
      activeFieldId: this.jotaiStore.get(editorStore.activeFieldIdAtom),
    };
    debugLog("Taking a HistorySnapshot now!", snapshot);
    return snapshot;
  }

  /**
   * Restores application state to the provided history snapshot.
   * (does not interact with the history stack in any way)
   */
  private restoreSnapshot(snapshot: HistorySnapshot): void {
    try {
      // disable state change handling, because we are about to change state
      this.isStateObservationEnabled = false;

      // essential state
      this.jotaiStore.set(formStore.formDataAtom, snapshot.formData);
      reportStore.quillExtended.setContents(snapshot.reportDelta, "api");
      this.jotaiStore.set(
        reportStore.reportLanguageAtom,
        snapshot.reportLanguage,
      );

      // surrounding state
      if (snapshot.reportSelection !== null) {
        reportStore.quillExtended.setSelection(
          snapshot.reportSelection.index,
          snapshot.reportSelection.length,
          "api",
        );
      }
      this.jotaiStore.set(editorStore.appModeAtom, snapshot.appMode);
      this.jotaiStore.set(
        editorStore.activeFieldIdAtom,
        snapshot.activeFieldId,
      );
    } finally {
      // enable state change handling again
      this.isStateObservationEnabled = true;
    }
  }

  /**
   * Creates an empty history snapshot, that is used for empty history stack
   */
  private createEmptySnapshot(): HistorySnapshot {
    return {
      eventName: "emptySnapshot",
      isCosmeticChange: false,
      takenAt: new Date(),
      formData: null,
      reportDelta: { ops: [] },
      reportLanguage: null,
      reportSelection: null,
      appMode: AppMode.EDIT_TEXT,
      activeFieldId: null,
    };
  }

  ///////////////////////
  // State Observation //
  ///////////////////////

  /**
   * Whether app state changes should be observed. This value is set
   * to false when a state is being restored by this HistoryStore,
   * so that it does not loop back on itself.
   */
  private isStateObservationEnabled: boolean = true;

  /**
   * Called by various event handlers, whenever some application state changes,
   * that ought to trigger a history snapshot. It is not required to debounce
   * calling this function, debouncing happens inside of it.
   */
  private handleGenuineApplicationStateChange(
    eventName: string,
    cosmeticChange: boolean,
  ): void {
    // do nothing if observation is disabled
    if (!this.isStateObservationEnabled) {
      return;
    }

    // read
    let pointerCopy = this.stackPointer;
    let stackCopy = [...this.stack]; // create array copy
    const newSnapshot = this.takeSnapshot(eventName, cosmeticChange);
    const previousSnapshot = stackCopy[pointerCopy] || newSnapshot;

    // clear stack after the pointer
    while (stackCopy.length > pointerCopy + 1) {
      stackCopy.pop();
    }

    // replace last if early enough
    const sameEventName = previousSnapshot.eventName === eventName;
    const recentEnoughForReplacement =
      newSnapshot.takenAt.valueOf() - previousSnapshot.takenAt.valueOf() <
      DEBOUNCE_TIME_MS;
    const performReplacement = sameEventName && recentEnoughForReplacement;
    if (performReplacement) {
      if (stackCopy.length > 0) {
        stackCopy[stackCopy.length - 1] = newSnapshot;
      } else {
        stackCopy.push(newSnapshot); // malformed edgecase when the stack is empty
      }
    } // else append new history item
    else {
      // add item to stack
      stackCopy.push(newSnapshot);

      // limit stack size
      while (stackCopy.length > MAX_STACK_SIZE) {
        stackCopy.shift();
      }
    }

    // update stack pointer
    pointerCopy = stackCopy.length - 1;

    // write new state
    this.stackPointer = pointerCopy;
    this.stack = stackCopy;

    debugLog(
      `Observed '${eventName}' ${cosmeticChange ? "(cosmetic) " : ""}` +
        `and did STACK ${performReplacement ? "REPLACE" : "APPEND"}, ` +
        `resulting in stack:`,
      pointerCopy,
      stackCopy,
    );

    // emit event
    this._onApplicationStateChange.dispatch({
      changeKind: "app",
      fromSnapshot: previousSnapshot,
      toSnapshot: newSnapshot,
      isCosmeticChange: newSnapshot.isCosmeticChange,
    });
  }

  /**
   * Registers event listeners to observe the application state
   */
  private startObservingApplication(): void {
    formStore.eventEmitter.on("formDataChanged", (e) => {
      this.handleGenuineApplicationStateChange("formDataChanged", false);
    });

    reportStore.eventEmitter.on("reportDeltaChanged", (e) => {
      this.handleGenuineApplicationStateChange("reportDeltaChanged", false);
    });

    reportStore.eventEmitter.on("reportLanguageChanged", (e) => {
      this.handleGenuineApplicationStateChange("reportLanguageChanged", false);
    });

    editorStore.eventEmitter.on("appModeChanged", (e) => {
      this.handleGenuineApplicationStateChange("appModeChanged", true);
    });
  }

  ////////////
  // Events //
  ////////////

  private readonly _onApplicationStateChange =
    new SimpleEventDispatcher<ApplicationStateChangeMetadata>();

  /**
   * Event that fires anytime the application state changes
   * (basically any change to the history state).
   * The AutosaveStore observes this event to trigger file saves.
   */
  public get onApplicationStateChange(): ISimpleEvent<ApplicationStateChangeMetadata> {
    return this._onApplicationStateChange.asEvent();
  }
}

/**
 * A snapshot of the state of the application in a moment in time
 */
export interface HistorySnapshot {
  /**
   * The event that triggered this snapshot.
   * Nearby snapshots are only merged if they were caused by the same event.
   */
  readonly eventName: string;

  /**
   * When true, this is a change in the app state, but this change does not
   * need to be written to the file (does not need to be saved).
   */
  readonly isCosmeticChange: boolean;

  /**
   * When was this snapshot taken
   */
  readonly takenAt: Date;

  /**
   * The data of the from from JSON Forms (a large JSON object)
   */
  readonly formData: any;

  /**
   * Delta-representation of the quill rich text editor holding the report text.
   * This also holds highlights in its formatting details.
   */
  readonly reportDelta: QDelta;

  /**
   * Language assigned to the report text
   */
  readonly reportLanguage: IsoLanguage | null;

  /**
   * Report text selection position (cursor position)
   */
  readonly reportSelection: TextRange | null;

  /**
   * Current application mode (text, anonymize, fillout form)
   */
  readonly appMode: AppMode;

  /**
   * The selected (active) field in the form
   */
  readonly activeFieldId: string | null;
}

/**
 * Metadata for the app state change event,
 * this event is raised by the HistoryStore whenever the application state
 * changes (in the debounced way). Used by the AutosaveStore to trigger saves.
 */
export interface ApplicationStateChangeMetadata {
  /**
   * Who caused the state change.
   * "app": The application via its regular functions (user interactions).
   * "clear": The history was cleared, because a new file was open.
   * "undo": The undo operation was performed.
   * "redo": The redo operation was performed.
   */
  readonly changeKind: "app" | "clear" | "undo" | "redo";

  /**
   * The snapshot this change moved away from
   */
  readonly fromSnapshot: HistorySnapshot;

  /**
   * The snapshot this change moved towards
   * (this is the current state of the application)
   */
  readonly toSnapshot: HistorySnapshot;

  /**
   * Was the change cosmetic? Meaning the file does need to be saved.
   */
  readonly isCosmeticChange: boolean;
}
