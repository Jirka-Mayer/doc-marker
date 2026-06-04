import Quill from "quill";
import { defineAnonymizationAttributor } from "./anonymization/defineAnonymizationAttributor";
import {
  allHighlightFormatNames,
  defineHighlightAttributors,
} from "./highlights/defineHighlightAttributors";
import { styles, allHighlightNumbers } from "./ui/quillStyles";
import { WordSelector } from "./WordSelector";
import { DeltaMapper } from "./DeltaMapper";
import { HighlightsAllocator } from "./highlights/HighlightsAllocator";
import { QuillStateRenderer } from "./ui/QuillStateRenderer";
import { getInlineFormatRange } from "./getInlineFormatRange";
import { htmlTableToDelta } from "./htmlTableToDelta";
import { contentsToHighlights } from "./highlights/contentsToHighlights";
import { AppMode } from "../state/AppMode";
import { isInsert, QAttributes, QDelta } from "./QDelta";
import { QSource } from "./QSource";
import { QRange } from "./QRange";
import { QBounds } from "./QBounds";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { EditorStore } from "../state/EditorStore";

// extend Quill with custom attributors
defineAnonymizationAttributor();
defineHighlightAttributors();

export interface TextChangedEventArgs {
  readonly delta: QDelta;
  readonly oldContents: QDelta;
  readonly source: QSource;
}

export interface SelectionChangedEventArgs {
  readonly range: QRange;
  readonly oldRange: QRange;
  readonly source: QSource;
}

/**
 * Works exactly like the Quill class with the same API, but encapsulates
 * the added functionality, such as highlihts and anonymization.
 * It should have the same API as Quill (if implemented) and then provide
 * some additional API for the extended logic.
 */
export class QuillExtended {
  private readonly editorStore: EditorStore;

  private readonly containerElement: HTMLDivElement;
  private readonly quillElement: HTMLDivElement;

  private readonly quill: Quill;

  private readonly highlightsAllocator: HighlightsAllocator;
  private readonly wordSelector: WordSelector;
  private readonly stateRenderer: QuillStateRenderer;
  private readonly deltaMapper: DeltaMapper;

  /**
   * The class constructor is different than for Quill class, because this
   * extended class creates its own container element in order to bind
   * to DOM dynamically and play well with React. Also no options are needed.
   */
  constructor(editorStore: EditorStore) {
    this.editorStore = editorStore;

    // one container element containing everything
    // the quill-instance element is inside
    this.containerElement = document.createElement("div");
    this.quillElement = document.createElement("div");
    this.containerElement.appendChild(this.quillElement);

    // create the inner quill instance
    this.quill = this.quill_constructInstance();
    this.quill_addClipboardMatchers();
    this.quill_preventDefaultOnHistoryShortcuts();
    this.quill_preventDefaultFormattingShortcuts();
    this.quill_connectEvents();

    // allocators
    this.highlightsAllocator = new HighlightsAllocator(allHighlightNumbers);

    // handles the mode where we select only entire words
    this.wordSelector = new WordSelector(this.quill);

    // sets proper root CSS classes
    this.stateRenderer = new QuillStateRenderer(
      this.quillElement,
      this.containerElement,
      this.highlightsAllocator,
    );

    // converts between in internal and exteral delta format
    this.deltaMapper = new DeltaMapper(this.highlightsAllocator);

    // forget anonymized text when app mode changes to anything
    // other than the anonymization mode
    this.registerAnonymizationAppModeListener();
  }

  private quill_constructInstance(): Quill {
    this.quillElement.setAttribute("spellcheck", "false");

    return new Quill(this.quillElement, {
      theme: false,
      modules: {
        toolbar: false,
        history: false,
      },
      placeholder: "Paste source text in here...", // overriden by QuillBinder
      formats: [
        // inline
        "bold",
        "italic",
        "underline",
        "strike",

        // block
        "header",

        // custom (inline)
        "anonymized",
        ...allHighlightFormatNames,
      ],
    });
  }

  private quill_addClipboardMatchers(): void {
    this.quill.clipboard.addMatcher("table", function (node, delta) {
      return htmlTableToDelta(node);
    });
  }

  private quill_preventDefaultOnHistoryShortcuts(): void {
    // ctrl+z/y normally perform undo/redo on the "contenteditable" elements
    // inside quill. We will capture the events on their propagation down the
    // hierarchy and prevent their default behaviour.
    //
    // they will be caught when bubbling back up on the document listener
    // belonging to the history system
    this.quillElement.addEventListener(
      "keydown",
      (e) => {
        if (e.key.toLowerCase() === "z" && e.ctrlKey) {
          e.preventDefault();
        }
        if (e.key.toLowerCase() === "y" && e.ctrlKey) {
          e.preventDefault();
        }
      },
      { capture: true },
    );
  }

  private quill_preventDefaultFormattingShortcuts(): void {
    // These shortcuts are implemented by the Format menu instead
    this.quillElement.addEventListener(
      "keydown",
      (e) => {
        if (e.key.toLowerCase() === "b" && e.ctrlKey) {
          e.preventDefault();
        }
        if (e.key.toLowerCase() === "i" && e.ctrlKey) {
          e.preventDefault();
        }
        if (e.key.toLowerCase() === "u" && e.ctrlKey) {
          e.preventDefault();
        }
      },
      { capture: true },
    );
  }

  ///////////////
  // Rendering //
  ///////////////

  /**
   * Attaches the quill editor to a given parent element
   */
  public attachTo(parentElement: HTMLElement): void {
    if (this.containerElement.parentElement === parentElement) {
      return; // attached already
    }

    // detach from existing and attach here
    this.detach();
    parentElement.appendChild(this.containerElement);
  }

  /**
   * Detaches the element from the parent component
   */
  public detach(): void {
    if (this.containerElement.parentElement === null) return; // already detached

    this.containerElement.remove(); // detach
  }

  /**
   * Call this to update the DOM according to the active field
   */
  public renderFieldActivity(activeFieldId: string | null): void {
    this.stateRenderer.renderFieldActivity(activeFieldId);
  }

  /**
   * Call this to update the DOM according to the application mode
   */
  public renderAppMode(appMode: AppMode): void {
    this.stateRenderer.renderAppMode(appMode);
  }

  /**
   * Change the placeholder text (e.g. when the language changes)
   * Used by the QuillBinder
   */
  public setPlaceholderText(placeholder: string): void {
    this.quill.root.dataset.placeholder = placeholder;
  }

  /**
   * Constructs a visualization of highlights
   * ID mapping for debugging purposes
   */
  public renderHighlightIdMap(): string {
    return this.highlightsAllocator.renderHighlightIdMap();
  }

  //////////////////////////
  // Translated Quill API //
  //////////////////////////

  // https://v1.quilljs.com/docs/api

  // Content //
  // ------- //

  // MISSING: deleteText

  public getContents(
    index: number = 0,
    length: number | undefined = undefined,
  ): QDelta {
    const internalDelta = this.quill.getContents(index, length);
    const externalDelta = this.deltaMapper.exportDelta(internalDelta);
    return externalDelta;
  }

  public getLength(): number {
    return this.quill.getLength();
  }

  public getText(
    index: number = 0,
    length: number | undefined = undefined,
  ): string {
    return this.quill.getText(index, length);
  }

  // MISSING: insertEmbed

  // MISSING: insertText

  public setContents(delta: QDelta, source: QSource = "api"): void {
    // import content
    const internalDelta = this.deltaMapper.importDelta(delta);
    this.quill.setContents(internalDelta, source);

    this.refreshHighlightsDueToContentUpdate();
  }

  // MISSING: setText

  public updateContents(delta: QDelta, source: QSource = "api"): void {
    // import delta
    const internalDelta = this.deltaMapper.importDelta(delta);
    this.quill.updateContents(internalDelta, source);

    this.refreshHighlightsDueToContentUpdate();
  }

  private refreshHighlightsDueToContentUpdate(): void {
    // release unused allocator numbers
    const newExternalContents = this.getContents();
    let newHighlights = contentsToHighlights(newExternalContents);
    this.highlightsAllocator.releaseUnlistedIds(Object.keys(newHighlights));

    // re-render active highlight (due to the allocator release)
    this.stateRenderer.refresh();
  }

  // Formatting //
  // ---------- //

  public format(name: string, value: any, source: QSource = "api"): void {
    const [nameInternal, valueInternal] = this.deltaMapper.importAttribute(
      name,
      value,
    );

    this.quill.format(nameInternal, valueInternal, source);

    // custom event that triggers react to re-render active formats
    this.onSelectedFormatChangedDispatcher.dispatch(this.getFormat());
  }

  public formatLine(
    range: QRange,
    formats: QAttributes,
    source: QSource = "api",
  ): void {
    const internalFormats = this.deltaMapper.importAttributesObject(formats);
    this.quill.formatLine(range.index, range.length, internalFormats, source);
  }

  public formatText(
    range: QRange,
    formats: QAttributes,
    source: QSource = "api",
  ): void {
    const internalFormats = this.deltaMapper.importAttributesObject(formats);
    this.quill.formatText(range.index, range.length, internalFormats, source);
  }

  public getFormat(range: QRange | undefined = undefined): QAttributes {
    if (this.quill.getSelection() === null) return {};

    const formatsInternal = this.quill.getFormat(range);
    return this.deltaMapper.exportAttributesObject(formatsInternal);
  }

  public removeFormat(
    range: QRange | null | undefined = undefined,
    source: QSource = "api",
  ): void {
    if (!range) {
      range = this.getSelection();
    }

    if (!range) {
      return;
    }

    // we cannot just remove all formats because that would remove
    // anonymizations and highlights as well. We need to explicitly disable
    // all possible formats by removing them.
    this.formatText(
      range,
      {
        bold: false,
        italic: false,
        underline: false,
        strike: false,
      },
      source,
    );
    this.formatLine(
      range,
      {
        header: false,
      },
      source,
    );
  }

  // Selection //
  // --------- //

  public getBounds(index: number, length: number = 0): QBounds {
    return this.quill.getBounds(index, length);
  }

  /**
   * Same as getBound, but relative to the whole page,
   * not just to the quill HTML element
   */
  public getBoundsInPage(index: number, length: number = 0): QBounds {
    const bounds = this.getBounds(index, length);
    const rect = this.quillElement.getBoundingClientRect();
    return {
      top: rect.top + bounds.top,
      left: rect.left + bounds.left,
      width: bounds.width,
      height: bounds.height,
    };
  }

  public getSelection(focus: boolean = false): QRange | null {
    return this.quill.getSelection(focus);
  }

  public setSelection(
    index: number,
    length: number = 0,
    source: QSource = "api",
  ): void {
    this.quill.setSelection(index, length, source);
  }

  // Editor //
  // ------ //

  public blur(): void {
    this.quill.blur();
  }

  public focus(): void {
    this.quill.focus();
  }

  public disable(): void {
    this.enable(false);
  }

  public enable(enabled: boolean = true): void {
    this.quill.enable(enabled);
  }

  public hasFocus(): boolean {
    return this.quill.hasFocus();
  }

  // MISSING: update

  // Events //
  // ------ //

  private readonly onTextChangedDispatcher =
    new SimpleEventDispatcher<TextChangedEventArgs>();

  /**
   * Fires when text contents change
   */
  public get onTextChanged(): ISimpleEvent<TextChangedEventArgs> {
    return this.onTextChangedDispatcher.asEvent();
  }

  private readonly onSelectionChangedDispatcher =
    new SimpleEventDispatcher<SelectionChangedEventArgs>();

  /**
   * Fires when text selection range changes
   */
  public get onSelectionChanged(): ISimpleEvent<SelectionChangedEventArgs> {
    return this.onSelectionChangedDispatcher.asEvent();
  }

  private quill_connectEvents(): void {
    this.quill.on("text-change", this.onInternalTextChanged.bind(this));
    this.quill.on(
      "selection-change",
      this.onInternalSelectionChanged.bind(this),
    );
  }

  private onInternalTextChanged(
    internalDelta: QDelta,
    internalOldContents: QDelta,
    source: QSource,
  ) {
    const externalDelta = this.deltaMapper.exportDelta(internalDelta);
    const externalOldContents =
      this.deltaMapper.exportDelta(internalOldContents);
    this.onTextChangedDispatcher.dispatch({
      delta: externalDelta,
      oldContents: externalOldContents,
      source: source,
    });
  }

  private onInternalSelectionChanged(
    range: QRange,
    oldRange: QRange,
    source: QSource,
  ) {
    // let the word selector have a say in what gets emitted to the outside
    if (
      this.wordSelector.interceptSelectionChangeEvent(range, oldRange, source)
    ) {
      return; // prevent event propagation when true is returned
    }

    this.onSelectionChangedDispatcher.dispatch({
      range,
      oldRange,
      source,
    });
  }

  /////////////////////////////
  // Extended Quill-like API //
  /////////////////////////////

  // Word Selection //
  // -------------- //

  /**
   * Enables the word selection mode
   */
  public enableWordSelection(enabled: boolean = true): void {
    this.wordSelector.isEnabled = enabled;
  }

  /**
   * Disables the word selection mode
   */
  public disableWordSelection(): void {
    this.enableWordSelection(false);
  }

  /**
   * Checks whether word selection mode is enabled
   */
  public isWordSelectionEnabled(): boolean {
    return this.wordSelector.isEnabled;
  }

  // Selection //
  // --------- //

  /**
   * If the users clicks (changes selection to length 0),
   * this method checks whether the selection is at the end/beginning
   * of text line, in which case the user probably clicked next to the
   * text, or if the click actually was over the textual content
   */
  public isClickInsideText(index: number): boolean {
    if (this.getText(index, 1) == "\n") {
      // after the end of a line
      return false;
    }

    if (this.getText(index - 1, 1) == "\n") {
      // before the start of a line
      return false;
    }

    if (index == 0) {
      // before the start of the text
      return false;
    }

    return true;
  }

  // Formatting //
  // ---------- //

  /**
   * Returns a range, where the format at the given position with the given value
   * starts and ends. Returns null if there is not such format at the position.
   * Only inline-formats are supported, block-formats are ignored.
   */
  public getInlineFormatRange(
    index: number,
    formatName: string,
    formatValue: any,
  ): QRange | null {
    const [internalName, internalValue] = this.deltaMapper.importAttribute(
      formatName,
      formatValue,
    );
    return getInlineFormatRange(this.quill, index, internalName, internalValue);
  }

  // Anonymization //
  // ------------- //

  /**
   * Anonymizes (or removes anonymization) of a given kind in a given range
   * (handles only the anonymized text format, does not forget the text itself)
   * @param {number} index Range start
   * @param {number} length Range length
   * @param {string} kindId Kind of the anonymized data
   * @param {string} source Who triggered the update (quill source)
   */
  public anonymizeText(
    index: number,
    length: number,
    kindId: string = "",
    source: QSource = "api",
  ): void {
    this.quill.formatText(
      index,
      length,
      {
        ["anonymized"]: kindId,
      },
      source,
    );
  }

  /**
   * Get the range of anonymized text at a given text location,
   * returns null if there is no anonymized text at this location
   */
  public getAnonymizedRange(index: number): QRange | null {
    const value = this.quill.getFormat(index)["anonymized"];

    if (!value) {
      return null;
    }

    return getInlineFormatRange(this.quill, index, "anonymized", value);
  }

  /**
   * Returns the anonymization kind in a given range
   */
  public getAnonymization(index: number, length: number): string | null {
    return this.quill.getFormat(index, length)["anonymized"] || null;
  }

  /**
   * Replaces anonmized text in the given range with asterisks.
   * The text format within this range should be uniform, otherwise
   * it may get edited.
   */
  public forgetTextAt(range: QRange): void {
    const text = this.getText(range.index, range.length);
    const format = this.getFormat(range);
    this.updateContents({
      ops: [
        {
          retain: range.index,
        },
        {
          delete: range.length,
        },
        {
          insert: this.asteriskizeString(text),
          attributes: format, // preserves the anonymized region
        },
      ],
    });
  }

  /**
   * Replaces all meaningful characters of a string with asterisks
   */
  private asteriskizeString(input: string): string {
    return [...input]
      .map((c) => {
        if (c === " " || c === "\n" || c === "\r" || c === "\t") {
          return c;
        }

        return "*";
      })
      .join("");
  }

  /**
   * Goes over the whole content of the editor and forgets
   * (replaces with asterisks) all text that is anonymized
   * (marked in anonymization format of any kind).
   */
  public forgetAllAnonymizedText(): void {
    // get the current contents delta
    const contents = this.getContents();

    // go over all inserts and asteriskize anonymization inserts
    for (let op of contents.ops) {
      if (isInsert(op)) {
        if (op.attributes && op.attributes["anonymized"]) {
          op.insert = this.asteriskizeString(op.insert);
        }
      } else {
        throw new Error("Unexpected operation type");
      }
    }

    // write back the updated contents delta
    this.setContents(contents);
  }

  /**
   * Register an event handler for app mode change such that
   * when the user changes to any other mode than anonymization
   * mode, we will trigger anonymized text forgetting.
   */
  private registerAnonymizationAppModeListener(): void {
    this.editorStore.onAppModeEntered.subscribe(() => {
      if (this.editorStore.appMode !== AppMode.ANONYMIZE) {
        this.forgetAllAnonymizedText();
      }
    });
  }

  // Events //
  // ------ //

  private readonly onSelectedFormatChangedDispatcher =
    new SimpleEventDispatcher<QAttributes>();

  /**
   * Fires when the set of formats under the cursor change
   * - used to update the Toolbar UI through React.
   */
  public get onSelectedFormatChanged(): ISimpleEvent<QAttributes> {
    return this.onSelectedFormatChangedDispatcher.asEvent();
  }

  // Highlights //
  // ---------- //

  /**
   * Highlights (or removes highlight) for a given field in a given range
   * @param {number} index Range start
   * @param {number} length Range length
   * @param {string} fieldId ID of the form field
   * @param {boolean} highlighted Set false to remove highlight for the field
   * @param {string} source Who triggered the update (quill source)
   */
  public highlightText(
    index: number,
    length: number,
    fieldId: string,
    highlighted: boolean = true,
    source: QSource = "api",
  ): void {
    const highlightNumber =
      this.highlightsAllocator.getHighlightNumber(fieldId);
    this.quill.formatText(
      index,
      length,
      {
        ["highlight-" + highlightNumber]: highlighted ? "yes" : "",
      },
      source,
    );
  }

  /**
   * Given a field ID and text location, returns the
   * range of the field's highlight at this location.
   */
  public getHighlightRange(index: number, fieldId: string): QRange | null {
    const highlightNumber =
      this.highlightsAllocator.getHighlightNumber(fieldId);
    return getInlineFormatRange(
      this.quill,
      index,
      "highlight-" + highlightNumber,
      "yes",
    );
  }

  // scroll into view state
  private lastScrollIntoViewFieldId: string | null = null;
  private lastScrollIntoViewElementIndex: number = -1;

  /**
   * Scrolls the first highlight for the given fieldId into view.
   * If there are multiple highlights, then calling this function
   * repeatedly loops over them.
   */
  public scrollHighlightIntoView(fieldId: string): void {
    // get highlight span elements
    const highlightNumber =
      this.highlightsAllocator.getHighlightNumber(fieldId);
    let elements = Array.from(
      this.quillElement.querySelectorAll(
        "." + styles[`highlight-${highlightNumber}-yes`],
      ),
    );

    if (elements.length === 0) {
      return;
    }

    // "group" elements that are close together
    // (by removing those that are too close)
    let position = elements[0].getBoundingClientRect().top;
    let threshold = 100; // pixels
    for (let i = 1; i < elements.length; i++) {
      let p = elements[i].getBoundingClientRect().top;
      if (p < position + threshold) {
        elements.splice(i, 1);
        i -= 1;
      } else {
        position = p;
      }
    }

    // get the next element index to sroll to
    let index = 0;
    if (this.lastScrollIntoViewFieldId === fieldId) {
      index = (this.lastScrollIntoViewElementIndex + 1) % elements.length;
    }

    // store the state
    this.lastScrollIntoViewFieldId = fieldId;
    this.lastScrollIntoViewElementIndex = index;

    // scroll
    elements[index].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  /**
   * Removes all highlights formatting from the report text
   */
  public removeAllHighlights(source: QSource = "api"): void {
    const attributes: QAttributes = {};
    for (const number of allHighlightNumbers) {
      attributes["highlight-" + number] = "";
    }

    this.quill.formatText(0, this.getText().length, attributes, source);
  }
}
