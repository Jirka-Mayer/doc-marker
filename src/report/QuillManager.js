import Quill from "quill"
import { AppMode } from "../core/AppMode"
import { defineHighlightAttributors } from "./defineHighlightAttributors"
import { FieldNumberAllocator } from "./FieldNumberAllocator"
import { HighlightManager } from "./HighlightManager"
import { styles, activeCssClassSet, allFieldNumbers } from "./quillStyles"

// extend Quill with highlight attributors
defineHighlightAttributors()

/**
 * Wrapper around quill, providing additional logic like the highlights
 */
export class QuillManager {
  constructor(onTextChange) {
    // callback called when quill content changes
    this.onTextChange = onTextChange

    this.numberAllocator = new FieldNumberAllocator(allFieldNumbers)
    
    // one container element containing everything
    // the quill-instance element is inside
    this.containerElement = document.createElement("div")
    this.quillElement = document.createElement("div")
    this.containerElement.appendChild(this.quillElement)

    // create the quill instance
    this.quill = this.constructQuillInstance()

    // create highlight manager
    this.highlightManager = new HighlightManager(
      this.quill,
      this.numberAllocator
    )

    // TODO: DEBUG: initialize dummy content
    // figure out where to perform content initialization with respect to react state
    this.setContents({ ops: [
      { insert: "Hello " },
      { insert: "world!", attributes: { "highlight://#/properties/age": true } },
      { insert: "\n" },
      { insert: "Hello", attributes: { "highlight://#/properties/gender": true } },
      { insert: " world!\n"}
    ]})

    // listen for changes
    this.startListening()
  }

  constructQuillInstance() {
    return new Quill(this.quillElement, {
      theme: "snow",
      placeholder: "Paste discharge report here...\nTODO: Localization",
      formats: [
        // inline
        "bold", "italic", "underline", "strike", "script",
        
        // block
        "header",
        
        // custom
        ...HighlightManager.getHighlightFormats()
      ]
    })
  }

  startListening() {
    this.quill.on("text-change", (delta, oldContents, source) => {
      this.onTextChange(
        this.numberAllocator.deltaToIds(delta)
      )
    })
  }

  /////////////////////
  // Content & State //
  /////////////////////

  /**
   * Like the quill's setContents, but it translates highlight IDs automatically
   */
  setContents(delta, source) {
    this.quill.setContents(
      this.numberAllocator.deltaToNumbers(delta),
      source
    )
  }

  /**
   * Returns the content of the quill editor as a delta
   */
  getContents() {
    let delta = this.quill.getContents()
    return this.numberAllocator.deltaToIds(delta)
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
    this.containerElement.remove()
    parentElement.appendChild(this.containerElement)
  }

  /**
   * Call this to update the DOM according to the application mode
   */
  renderAppMode(appMode) {
    if (appMode === AppMode.EDIT_TEXT) {
      this.quill.enable(true)
      this.highlightManager.setIsAnnotating(false)
      this.containerElement.classList.remove(styles["annotating-mode"])
    }

    if (appMode === AppMode.ANNOTATE_HIGHLIGHTS) {
      this.quill.enable(false)
      this.highlightManager.setIsAnnotating(true)
      this.containerElement.classList.add(styles["annotating-mode"])
    }
  }

  /**
   * Call this to update the DOM according to the active field
   */
  renderFieldActivity(fieldId) {
    this.highlightManager.setActiveFieldId(fieldId)

    // remove all of our css classes
    Array.from(this.quillElement.classList.values())
      .filter(name => activeCssClassSet.has(name))
      .forEach(name => this.quillElement.classList.remove(name))

    // no field is active
    if (fieldId === null)
      return
    
    // add the proper activity css class
    const activeFieldNumber = this.numberAllocator.getNumber(fieldId)
    this.quillElement.classList.add(styles["active-" + activeFieldNumber])
  }
}