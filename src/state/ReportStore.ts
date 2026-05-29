import { SignalDispatcher, SimpleEventDispatcher } from "strongly-typed-events";
import { JotaiStore } from "./JotaiStore";
import { IsoLanguage } from "../IsoLanguage";
import { Atom, atom, PrimitiveAtom } from "jotai";
import { TextRange } from "../utils/TextRange";
import { QAttributes, QDelta } from "../quill/QDelta";
import { QuillExtended } from "../quill/QuillExtended";
import { contentsToHighlights } from "../quill/highlights/contentsToHighlights";
import _ from "lodash";
import { Highlights } from "../quill/Highlights";
import { AtomGroup } from "./AtomGroup";
import { assignIfNeeded } from "../utils/assignIfNeeded";

export interface OnReportLanguageChangedEventArgs {
  readonly newValue: IsoLanguage | null;
}

/**
 * Manages state related to the report column
 * and exposes it to React. For state that is tracked primarily
 * by QuillExtended, this store exposes only its read-only variants
 * to React. For writing, call methods on the QuillExtended instance.
 */
export class ReportStore {
  private readonly jotaiStore: JotaiStore;
  private readonly quillExtended: QuillExtended;
  private readonly highlightsStore: HighlightsStore;

  constructor(jotaiStore: JotaiStore, quillExtended: QuillExtended) {
    this.jotaiStore = jotaiStore;
    this.quillExtended = quillExtended;

    this.highlightsStore = new HighlightsStore(jotaiStore);

    this.connectSelectionAtomsToQuillEvents();
    this.connectContentAtomsToQuillEvents();
  }

  ////////////////////////////////
  // Text Selection (read-only) //
  ////////////////////////////////

  /**
   * Exposes the Quill selection range value to React.
   * Read-only, for changing selection, call methods on
   * the QuillExtended instance.
   */
  public readonly selectionRangeAtom = atom((get) =>
    get(this.selectionRangeBaseAtom),
  );
  private readonly selectionRangeBaseAtom = atom<TextRange | null>(null);

  /**
   * Read-only view of the current Quill selection range
   */
  public get selectionRange(): TextRange | null {
    return this.jotaiStore.get(this.selectionRangeAtom);
  }

  /**
   * Exposes the current Quill getFormat() value
   * (i.e. formats currently active under the text selection/cursor)
   * Read-only, for changing formats, call methods on
   * the QuillExtended instance.
   */
  public readonly selectionFormatsAtom = atom((get) =>
    get(this.selectionFormatsBaseAtom),
  );
  private readonly selectionFormatsBaseAtom = atom<QAttributes>({});

  private connectSelectionAtomsToQuillEvents(): void {
    this.quillExtended.onTextChanged.subscribe((e) => {
      this.updateSelectionAtoms();
    });
    this.quillExtended.onSelectionChanged.subscribe((e) => {
      this.updateSelectionAtoms();
    });
    this.quillExtended.onSelectedFormatChanged.subscribe((format) => {
      this.updateSelectionAtoms();
    });
  }

  private updateSelectionAtoms(): void {
    this.jotaiStore.set(
      this.selectionRangeBaseAtom,
      this.quillExtended.getSelection(),
    );
    this.jotaiStore.set(
      this.selectionFormatsBaseAtom,
      this.quillExtended.getFormat(),
    );
  }

  ////////////////////////////////
  // Report Content (read-only) //
  ////////////////////////////////

  /**
   * Exposes the current Quill's Delta content.
   * Read-only. For modifications, call QuillExtended methods.
   */
  public readonly contentAtom = atom((get) => get(this.contentBaseAtom));
  private readonly contentBaseAtom = atom<QDelta>({ ops: [] });

  /**
   * Read-only view of the current Quill delta contents
   */
  public get content(): QDelta {
    return this.jotaiStore.get(this.contentAtom);
  }

  /**
   * Exposes the current Quill's plain-text content.
   * Read-only. For modifications, call QuillExtended methods.
   */
  public readonly textAtom = atom((get) => get(this.textBaseAtom));
  private readonly textBaseAtom = atom<string>("");

  /**
   * Read-only view of the current Quill text contents
   */
  public get text(): string {
    return this.jotaiStore.get(this.textAtom);
  }

  /**
   * Read-only atom that exposes the global view at all highlights
   * annotated in the report text.
   */
  public get highlightsAtom(): Atom<Highlights> {
    return this.highlightsStore.highlightsAtom;
  }

  /**
   * Fetches a read-only atom that exposes a list of highlihted
   * text ranges for a given field.
   */
  public getFieldHighlightsAtom(fieldId: string): Atom<TextRange[]> {
    return this.highlightsStore.fieldAtoms.get(fieldId);
  }

  /**
   * Fires when the report contents delta value changes
   * (text change, highlight change, anything really)
   */
  public get onReportDeltaChanged() {
    return this.onReportDeltaChangedDispatcher.asEvent();
  }
  private readonly onReportDeltaChangedDispatcher = new SignalDispatcher();

  private connectContentAtomsToQuillEvents(): void {
    const handleTextChangeDebounced = _.debounce(
      this.handleTextChange.bind(this),
      300,
    );

    this.quillExtended.onTextChanged.subscribe((e) => {
      // debounce user changes
      // (this is to ease React rendering, since when the user types,
      // we don't need to re-render with each key stroke. This is the
      // same debouncing logic that JsonForms do for their text-fields)
      if (e.source === "user") {
        handleTextChangeDebounced();
        return;
      }

      // but apply api changes immediately
      handleTextChangeDebounced.cancel();
      this.handleTextChange();
    });
  }

  private handleTextChange(): void {
    const contents = this.quillExtended.getContents();
    const text = this.quillExtended.getText();
    const highlights = contentsToHighlights(contents);

    // report delta and text atoms
    this.jotaiStore.set(this.contentBaseAtom, contents);
    if (this.jotaiStore.get(this.textBaseAtom) !== text) {
      this.jotaiStore.set(this.textBaseAtom, text);
    }

    // highlights atoms
    this.highlightsStore.updateAtomValues(highlights);

    // fire the report delta change event
    this.onReportDeltaChangedDispatcher.dispatch();
  }

  /////////////////////
  // Report Language //
  /////////////////////

  /**
   * Holds the currently set language for the report text.
   * Null means no language was set yet.
   */
  public readonly reportLanguageAtom = atom(
    (get) => get(this.reportLanguageBaseAtom),
    (get, set, newValue: IsoLanguage | null) => {
      set(this.reportLanguageBaseAtom, newValue);
      this.onReportLanguageChangedDispatcher.dispatch({
        newValue,
      });
    },
  );
  private readonly reportLanguageBaseAtom = atom<IsoLanguage | null>(null);

  /**
   * The currently set language of the report text
   */
  public get reportLanguage(): IsoLanguage | null {
    return this.jotaiStore.get(this.reportLanguageAtom);
  }
  public set reportLanguage(value: IsoLanguage | null) {
    this.jotaiStore.set(this.reportLanguageAtom, value);
  }

  /**
   * Fires when the report language value changes
   */
  public get onReportLanguageChanged() {
    return this.onReportLanguageChangedDispatcher.asEvent();
  }
  private readonly onReportLanguageChangedDispatcher =
    new SimpleEventDispatcher<OnReportLanguageChangedEventArgs>();
}

/**
 * Internal service that encapsulates logic for tracking
 * highlights ranges globally and also per-field.
 * All of these atoms are read-only and any changes
 * to the tracked values should be done by calling methods
 * on the QuillExtended instance.
 */
class HighlightsStore {
  private jotaiStore: JotaiStore;

  constructor(jotaiStore: JotaiStore) {
    this.jotaiStore = jotaiStore;
  }

  // === Global view ===

  /**
   * Read-only atom that exposes the global view
   * of all highlights in the report.
   */
  public readonly highlightsAtom = atom((get) => get(this.highlightsBaseAtom));
  private readonly highlightsBaseAtom = atom<Highlights>({});

  // === Per-field view ===

  private readonly fieldBaseAtoms = new AtomGroup<PrimitiveAtom<TextRange[]>>(
    (key: string) => atom<TextRange[]>([]),
  );

  /**
   * Read-only atoms that expose the highlights for individual fields
   */
  public readonly fieldAtoms = new AtomGroup<Atom<TextRange[]>>((key: string) =>
    atom((get) => get(this.fieldBaseAtoms.get(key))),
  );

  // === Update atoms based on new Quill state ===

  /**
   * Called by the parent ReportStore whenever the Quill's
   * delta content changes and thus these atoms
   * should be updated respectively.
   */
  public updateAtomValues(newValue: Highlights): void {
    const oldValue = this.jotaiStore.get(this.highlightsBaseAtom);
    const improvedNewValue = assignIfNeeded(oldValue, newValue);

    // set the global view
    this.jotaiStore.set(this.highlightsBaseAtom, improvedNewValue);

    // set individual field values (if they were modified)
    for (const key of Object.keys(improvedNewValue)) {
      if (improvedNewValue[key] !== oldValue[key]) {
        this.jotaiStore.set(
          this.fieldBaseAtoms.get(key),
          improvedNewValue[key],
        );
      }
    }

    // forget removed field highlights
    for (const key of Object.keys(oldValue)) {
      if (!improvedNewValue.hasOwnProperty(key)) {
        // is a removed value
        const fieldBaseAtom = this.fieldBaseAtoms.get(key);
        if (this.jotaiStore.get(fieldBaseAtom).length !== 0) {
          // if the ranges are not empty yet
          this.jotaiStore.set(fieldBaseAtom, []); // forget ranges
        }
      }
    }
  }
}
