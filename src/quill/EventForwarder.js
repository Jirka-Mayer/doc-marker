import { DeltaMapper } from "./DeltaMapper";
import { EventEmitter } from "../utils/EventEmitter";
import { WordSelector } from "./WordSelector"

export class EventForwarder {
  constructor(quill, wordSelector, deltaMapper, eventEmitter) {
    // internal quill instance
    this.quill = quill

    /** @type {WordSelector} */
    this.wordSelector = wordSelector

    /** @type {DeltaMapper} */
    this.deltaMapper = deltaMapper
    
    /** @type {EventEmitter} */
    this.eventEmitter = eventEmitter
  }

  registerListeners() {
    this.quill.on("text-change", this.onInternalTextChange.bind(this))
    this.quill.on("selection-change", this.onInternalSelectionChange.bind(this))
  }

  onInternalTextChange(internalDelta, internalOldContents, source) {
    const externalDelta = this.deltaMapper.exportDelta(internalDelta)
    const externalOldContents = this.deltaMapper.exportDelta(internalOldContents)
    this.eventEmitter.emit(
      "text-change",
      externalDelta,
      externalOldContents,
      source
    )
  }

  onInternalSelectionChange(range, oldRange, source) {
    // let the word selector have a say in what gets emitted to the outside
    if (this.wordSelector.interceptSelectionChangeEvent(range, oldRange, source))
      return // prevent event propagation when true is returned
    
    this.eventEmitter.emit(
      "selection-change",
      range,
      oldRange,
      source
    )
  }

  // MISSING: editor-change
}