import { AppMode } from "../../state/editor/AppMode"
import { IdToNumberAllocator } from "../utils/IdToNumberAllocator"
import { styles, activateHighlightClassSet } from "./quillStyles"

/**
 * Class responsible for setting the proper CSS classes on the quill element
 */
export class QuillStateRenderer {
  constructor(quillElement, containerElement, highlightsAllocator) {
    /** @type {HTMLDivElement} */
    this.quillElement = quillElement

    /** @type {HTMLDivElement} */
    this.containerElement = containerElement

    /** @type {IdToNumberAllocator} */
    this.highlightsAllocator = highlightsAllocator

    // last known state
    this.activeFieldId = null
  }

  /**
   * Refreshes the set of rendered CSS classes
   * (e.g. when the allocator gets reset)
   */
  refresh() {
    this.renderFieldActivity(this.activeFieldId)
  }

  /**
   * Makes sure that active field highlight is activated
   */
  renderFieldActivity(activeFieldId) {
    // remember state
    this.activeFieldId = activeFieldId

    // remove all of our highlight activation css classes
    Array.from(this.quillElement.classList.values())
      .filter(name => activateHighlightClassSet.has(name))
      .forEach(name => this.quillElement.classList.remove(name))

    // no field is active
    if (activeFieldId === null)
      return

    // add the proper activity css class
    const activeFieldNumber = this.highlightsAllocator.getNumber(activeFieldId)
    this.quillElement.classList.add(
      styles["activate-highlight-" + activeFieldNumber]
    )
  }

  /**
   * Sets the app mode CSS classes
   */
  renderAppMode(appMode) {
    if (appMode === AppMode.ANNOTATE_HIGHLIGHTS) {
      this.containerElement.classList.add(styles["annotating-mode"])
    } else {
      this.containerElement.classList.remove(styles["annotating-mode"])
    }
  }
}