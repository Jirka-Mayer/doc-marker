import { Atom, atom, PrimitiveAtom } from "jotai";
import * as historyStore from "./historyStore";
import { JotaiStore } from "./JotaiStore";
import { FileStateManager } from "./file/FileStateManager";

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
 * save file action on the FileStateManager.
 */
export class AutosaveStore {
  private readonly jotaiStore: JotaiStore;
  private readonly fileStateManager: FileStateManager;


  constructor(jotaiStore: JotaiStore, fileStateManager: FileStateManager) {
    this.jotaiStore = jotaiStore;
    this.fileStateManager = fileStateManager;

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

    this.fileStateManager.onBeforeFileClose.subscribe((e) => {
      if (this.jotaiStore.get(this.isDirtyAtom)) {
        this.fileStateManager.saveCurrentFile();
      }

      this.cancelScheduledAutosave();
    });

    this.fileStateManager.onFileSaved.subscribe((e) => {
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
    this.fileStateManager.saveCurrentFile();
  }
}
