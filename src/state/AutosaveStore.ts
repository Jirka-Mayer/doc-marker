import { Atom, atom, getDefaultStore, PrimitiveAtom } from "jotai";
import * as historyStore from "./historyStore";
import * as fileStore from "./fileStore";
import { JotaiStore } from "./JotaiStore";

/**
 * After this time of idling the autosave is triggered. If the user starts
 * editing the file before that, the idling timer is reset to zero.
 */
const AUTOSAVE_DEBOUNCE_DELAY_MS = 5_000;

/**
 * Performs automatic saving of changes to the DocMarker file.
 *
 * Observes the history stack of the HistoryStore (undo/redo) and when it does
 * not change for the AUTOSAVE_DEBOUNCE_DELAY_MS amount of time, it calls
 * save file action on the FileStore.
 */
export class AutosaveStore {
  private jotaiStore: JotaiStore = getDefaultStore();

  constructor() {
    // TODO: dependency-inject historyStore and fileStore, once they
    // get refactored into services like this one

    this.registerEventListeners();
  }

  private registerEventListeners() {
    historyStore.eventEmitter.on("clear", (e) => {
      this.jotaiStore.set(this.isDirtyBaseAtom, false);
      this.cancelScheduledAutosave();
    });

    historyStore.eventEmitter.on("change", (e) => {
      // ignore cosmetic changes
      if (e.cosmeticChange) {
        return;
      }

      this.setDirty();
    });

    fileStore.eventEmitter.on("beforeFileClose", (e) => {
      if (this.jotaiStore.get(this.isDirtyAtom)) {
        fileStore.saveCurrentFile();
      }

      this.cancelScheduledAutosave();
    });

    fileStore.eventEmitter.on("fileSaved", (e) => {
      this.jotaiStore.set(this.isDirtyBaseAtom, false);
      this.cancelScheduledAutosave();
    });
  }

  // === tracking of "isDirty" state ===

  /**
   * If the file is dirty, it should be saved on closing
   * and also autosave is enabled
   */
  public isDirtyAtom: Atom<boolean> = atom<boolean>((get) =>
    get(this.isDirtyBaseAtom),
  );

  private isDirtyBaseAtom: PrimitiveAtom<boolean> = atom<boolean>(false);

  /**
   * Call this to set the file dirty and ultimately trigger a save
   */
  public setDirty() {
    this.jotaiStore.set(this.isDirtyBaseAtom, true);
    this.scheduleAutosave();
  }

  // === autosave logic ===

  private autosaveTimeoutId: NodeJS.Timeout | null = null;

  private scheduleAutosave() {
    this.cancelScheduledAutosave();
    this.autosaveTimeoutId = setTimeout(
      this.onAutosaveTrigger.bind(this),
      AUTOSAVE_DEBOUNCE_DELAY_MS,
    );
  }

  private cancelScheduledAutosave() {
    if (this.autosaveTimeoutId === null) {
      return;
    }

    clearTimeout(this.autosaveTimeoutId);
    this.autosaveTimeoutId = null;
  }

  private onAutosaveTrigger() {
    this.autosaveTimeoutId = null;
    fileStore.saveCurrentFile();
  }
}
