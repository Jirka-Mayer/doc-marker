import { atom } from "jotai";
import { AppMode } from "./AppMode";
import { JotaiStore } from "./JotaiStore";
import { ISignal, SignalDispatcher } from "strongly-typed-events";
import { AtomGroup } from "./AtomGroup";

/**
 * Encapsulates state that's not intrinsic to the data being
 * annotated, but represents the state of the editor.
 * This includes the app mode, active field ID and
 * debugging view.
 */
export class EditorStore {
  private readonly jotaiStore: JotaiStore;

  constructor(jotaiStore: JotaiStore) {
    this.jotaiStore = jotaiStore;
  }

  //////////////////////
  // Application mode //
  //////////////////////

  /**
   * Atom that holds the global mode of the applicaiton
   * (text editing, anonymization, annotation).
   * The atom is settable, which fires corresponding events.
   */
  public readonly appModeAtom = atom(
    (get) => get(this.appModeBaseAtom),
    (get, set, value: AppMode) => {
      const oldMode = get(this.appModeBaseAtom);

      this.onBeforeAppModeExitedDispatcher.dispatch();

      set(this.appModeBaseAtom, value);

      this.onAppModeEnteredDispatcher.dispatch();
    },
  );
  private readonly appModeBaseAtom = atom<AppMode>(AppMode.EDIT_TEXT);

  /**
   * The global mode of the applicaiton
   * (text editing, anonymization, annotation),
   * is settable which changes the mode with all
   * the surrounding ceremony.
   */
  public get appMode(): AppMode {
    return this.jotaiStore.get(this.appModeAtom);
  }
  public set appMode(value: AppMode) {
    this.jotaiStore.set(this.appModeAtom, value);
  }

  /**
   * Event fires just before a given app mode is exited
   */
  public get onBeforeAppModeExited(): ISignal {
    return this.onBeforeAppModeExitedDispatcher.asEvent();
  }
  private readonly onBeforeAppModeExitedDispatcher = new SignalDispatcher();

  /**
   * Event fires just after a given app mode is entered
   */
  public get onAppModeEntered(): ISignal {
    return this.onAppModeEnteredDispatcher.asEvent();
  }
  private readonly onAppModeEnteredDispatcher = new SignalDispatcher();

  /////////////////////
  // Active Field ID //
  /////////////////////

  /**
   * Writable atom that stores the currently active field ID.
   * When null, it means no field is active.
   * (active field is the highlighted form field, that was last
   * interacted with, for which text highlights are being made)
   */
  public readonly activeFieldIdAtom = atom(
    (get) => get(this.activeFieldIdBaseAtom),
    (get, set, newValue: string | null) => {
      const oldValue = get(this.activeFieldIdBaseAtom);

      // set the old value field activity to false,
      // if there was actually a field active
      if (oldValue !== null) {
        set(this.fieldIsActiveBaseAtoms.get(oldValue), false);
      }

      // set the base atom
      set(this.activeFieldIdBaseAtom, newValue);

      // set the new field activity atom to true,
      // if there is actually a field active now
      if (newValue !== null) {
        set(this.fieldIsActiveBaseAtoms.get(newValue), true);
      }
    },
  );
  private readonly activeFieldIdBaseAtom = atom<string | null>(null);

  /**
   * Controls the currently active field ID,
   * null means no field is active.
   */
  public get activeFieldId(): string | null {
    return this.jotaiStore.get(this.activeFieldIdAtom);
  }
  public set activeFieldId(value: string | null) {
    this.jotaiStore.set(this.activeFieldIdAtom, value);
  }

  /**
   * Atoms that expose field activity from the perspective of a single
   * field. With values true/false based on whether that field is in fact
   * active. Atoms are settable, which is synchronized with the global
   * atom storing the active field ID.
   */
  public readonly fieldIsActiveAtoms = new AtomGroup((fieldId: string) =>
    atom<boolean, [newValue: boolean], void>(
      (get) => {
        // does NOT depend on the activeFieldIdBaseAtom intentionally,
        // to avoid triggering React re-renders for ALL fields but only
        // re-render the two fields whose activity actually changes.
        // It acts as two completely independent sets of atoms,
        // which happen to be synchronized in their respective setters.
        return get(this.fieldIsActiveBaseAtoms.get(fieldId));
      },
      (get, set, newValue: boolean) => {
        const activeFieldId = get(this.activeFieldIdBaseAtom);

        // we want to become active and are not currently
        if (newValue === true && activeFieldId !== fieldId) {
          set(this.activeFieldIdAtom, fieldId);
        }

        // we want to deactivate ourselves and we are active
        if (newValue === false && activeFieldId === fieldId) {
          set(this.activeFieldIdAtom, null);
        }

        // Anything else is activating ourselves when we already are
        // or deactivating ourselves, when we already are.
        // In either case do nothing.
      },
    ),
  );
  private readonly fieldIsActiveBaseAtoms = new AtomGroup((fieldId: string) =>
    atom<boolean>(fieldId == this.activeFieldId),
  );

  /////////////////////
  // Debug Info Mode //
  /////////////////////

  /**
   * When true, additional debugging info should
   * be displayed in the application UI
   */
  public readonly displayDebugInfoAtom = atom<boolean>(false);
}
