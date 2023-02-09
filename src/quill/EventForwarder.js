import { DeltaMapper } from "./DeltaMapper";
import { EventEmitter } from "./utils/EventEmitter";

export class EventForwarder {
  constructor(quill, deltaMapper, eventEmitter) {
    // internal quill instance
    this.quill = quill

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
    const externalDelta = this.deltaMapper.export(internalDelta)
    const externalOldContents = this.deltaMapper.export(internalOldContents)
    this.eventEmitter.emit(
      "text-change",
      externalDelta,
      externalOldContents,
      source
    )
  }

  onInternalSelectionChange(range, oldRange, source) {
    this.eventEmitter.emit(
      "selection-change",
      range,
      oldRange,
      source
    )
  }

  // MISSING: editor-change
}