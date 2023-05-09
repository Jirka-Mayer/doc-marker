import Quill from "quill"
import Delta from "quill-delta"
import { AppMode } from "../state/editor/AppMode"
import { defineAnonymizationAttributor } from "./anonymization/defineAnonymizationAttributor"
import {
  allHighlightFormatNames,
  defineHighlightAttributors
} from "./highlights/defineHighlightAttributors"
import { allHighlightNumbers } from "./ui/quillStyles"
import { WordSelector } from "./WordSelector"
import { DeltaMapper } from "./DeltaMapper"
import { IdToNumberAllocator } from "./utils/IdToNumberAllocator"
import { QuillStateRenderer } from "./ui/QuillStateRenderer"
import { EventEmitter } from "./utils/EventEmitter"
import { EventForwarder } from "./EventForwarder"
import { AnonymizationApi } from "./AnonymizationApi"
import { HighlightsApi } from "./HighlightsApi"
import { getInlineFormatRange } from "./utils/getInlineFormatRange"
import { htmlTableToDelta } from "./htmlTableToDelta"

// extend Quill with custom attributors
defineAnonymizationAttributor()
defineHighlightAttributors()

/**
 * Works exactly like the Quill class with the same API, but encapsulates
 * the added functionality, such as highlihts and anonymization.
 * It should have the same API as Quill (if implemented) and then provide
 * some additional API for the extended logic.
 */
export class QuillExtended {
  /**
   * The class constructor is different than for Quill class, because this
   * extended class creates its own container element in order to bind
   * to DOM dynamically and play well with React. Also no options are needed.
   */
  constructor() {
    // one container element containing everything
    // the quill-instance element is inside
    this.containerElement = document.createElement("div")
    this.quillElement = document.createElement("div")
    this.containerElement.appendChild(this.quillElement)

    // create the inner quill instance
    this.quill = this._constructQuillInstance()
    this._addClipboardMatchers()

    // allocators
    this.highlightsAllocator = new IdToNumberAllocator(
      allHighlightNumbers
    )

    // handles the mode where we select only entire words
    this.wordSelector = new WordSelector(this.quill)

    // sets proper root CSS classes
    this.stateRenderer = new QuillStateRenderer(
      this.quillElement,
      this.containerElement,
      this.highlightsAllocator
    )

    // converts between in internal and exteral delta format
    this.deltaMapper = new DeltaMapper(
      this.highlightsAllocator
    )

    // handles external event subscriptions
    this.eventEmitter = new EventEmitter()

    // forwards internal events into the external emitter
    this.eventForwarder = new EventForwarder(
      this.quill,
      this.wordSelector,
      this.deltaMapper,
      this.eventEmitter
    )
    this.eventForwarder.registerListeners()

    // extended API implementations
    this.anonymizationApi = new AnonymizationApi(
      this.quill,
      this.quillElement
    )
    this.highlightsApi = new HighlightsApi(
      this.quill,
      this.quillElement,
      this.highlightsAllocator
    )
  }

  _constructQuillInstance() {
    this.quillElement.setAttribute("spellcheck", false)

    return new Quill(this.quillElement, {
      theme: false,
      modules: {
        toolbar: false
      },
      placeholder: "Paste source text in here...",
      formats: [
        // inline
        "bold", "italic", "underline", "strike", "script",
        
        // block
        "header",
        
        // custom (inline)
        "anonymized",
        ...allHighlightFormatNames
      ]
    })
  }

  _addClipboardMatchers() {
    this.quill.clipboard.addMatcher("table", function (node, delta) {
      return htmlTableToDelta(node)
    });
  }

  ///////////////
  // Rendering //
  ///////////////

  /**
   * Attaches the quill editor to a given parent element
   */
   attachTo(parentElement) {
    if (this.containerElement.parentElement === parentElement) {
      return // attached already
    }
    
    // detach from existing and attach here
    this.detach()
    parentElement.appendChild(this.containerElement)
  }

  /**
   * Detaches the element from the parent component
   */
  detach() {
    if (this.containerElement.parentElement === null)
      return // already detached

    this.containerElement.remove() // detach
  }

  /**
   * Call this to update the DOM according to the active field
   */
  renderFieldActivity(activeFieldId) {
    this.stateRenderer.renderFieldActivity(activeFieldId)
  }

  /**
   * Call this to update the DOM according to the application mode
   */
  renderAppMode(appMode) {
    this.stateRenderer.renderAppMode(appMode)
  }


  //////////////////////////
  // Translated Quill API //
  //////////////////////////

  // https://quilljs.com/docs/api/

  // Content //
  // ------- //

  // MISSING: deleteText

  getContents(index, length = undefined) {
    const internalDelta = this.quill.getContents(index, length)
    const externalDelta = this.deltaMapper.export(internalDelta)
    return externalDelta
  }

  getLength() {
    return this.quill.getLength()
  }

  getText(index, length = undefined) {
    return this.quill.getText(index, length)
  }

  // MISSING: insertEmbed

  // MISSING: insertText

  setContents(delta, source = "api") {
    // reset allocators
    this.highlightsAllocator.reset()

    // import content
    const internalDelta = this.deltaMapper.import(delta)
    this.quill.setContents(internalDelta, source)

    // re-render active highlight (due to the allocator reset)
    this.stateRenderer.refresh()
  }

  // MISSING: setText

  // MISSING: updateContents

  // Formatting //
  // ---------- //

  // TODO: DeltaMapper -> map format names (highlight format names)

  // MISSING: format

  // MISSING: formatLine

  // MISSING: formatText

  // MISSING: getFormat

  // MISSING: removeFormat

  // Selection //
  // --------- //

  getBounds(index, length = 0) {
    return this.quill.getBounds(index, length)
  }

  getSelection(focus = false) {
    return this.quill.getSelection(focus)
  }

  setSelection(index, length = 0, source = "api") {
    return this.quill.setSelection(index, length, source)
  }

  // Editor //
  // ------ //

  blur() {
    this.quill.blur()
  }

  focus() {
    this.quill.focus()
  }

  disable() {
    this.enable(false)
  }

  enable(enabled = true) {
    this.quill.enable(enabled)
  }

  hasFocus() {
    return this.quill.hasFocus()
  }

  // MISSING: update

  // Events //
  // ------ //

  off(eventName, listener) {
    this.eventEmitter.off(eventName, listener)
  }

  on(eventName, listener) {
    this.eventEmitter.on(eventName, listener)
  }

  // MISSING: once


  /////////////////////////////
  // Extended Quill-like API //
  /////////////////////////////

  // Word Selection //
  // -------------- //

  /**
   * Enables (or disables) the selection mode that selects entire words only
   * @param {bool} enabled
   */
  enableWordSelection(enabled = true) {
    this.wordSelector.isEnabled = enabled
  }

  disableWordSelection() {
    this.enableWordSelection(false)
  }

  isWordSelectionEnabled() {
    return this.wordSelector.isEnabled
  }

  /**
   * If the users clicks (changes selection to length 0),
   * this method checks whether the selection is at the end/beginning
   * of text line, in which case the user probably clicked next to the
   * text, or if the click actually was over the textual content
   * @param {number} index
   */
  isClickInsideText(index) {
    if (this.getText(index, 1) == "\n") // after the end of line
      return false

    if (this.getText(index - 1, 1) == "\n") // before the start of line
      return false

    if (index == 0) // before the start of text
      return false

    return true
  }

  // Formatting //
  // ---------- //

  getInlineFormatRange(index, formatName, formatValue) {
    // TODO: DeltaMapper -> map format names (highlight format names)
    return getInlineFormatRange(this.quill, index, formatName, formatValue)
  }

  // Anonymization //
  // ------------- //

  /**
   * Anonymizes (or removes anonymization) for a given data kind in a given range
   * @param {number} index Range start
   * @param {number} length Range length
   * @param {string} kindId Kind of the anonymized data
   * @param {string} source Who triggered the update (quill source)
   */
  anonymizeText(index, length, kindId = "", source = "api") {
    this.anonymizationApi.anonymizeText(index, length, kindId, source)
  }

  getAnonymizedRange(index) {
    return this.anonymizationApi.getAnonymizedRange(index)
  }

  /**
   * Returns the anonymization kind in a given range
   */
  getAnonymization(index, length) {
    return this.quill.getFormat(index, length)["anonymized"]
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
  highlightText(index, length, fieldId, highlighted = true, source = "api") {
    this.highlightsApi.highlightText(
      index, length, fieldId, highlighted, source
    )
  }

  getHighlightRange(index, fieldId) {
    return this.highlightsApi.getHighlightRange(index, fieldId)
  }

  scrollHighlightIntoView(fieldId) {
    this.highlightsApi.scrollHighlightIntoView(fieldId)
  }
}