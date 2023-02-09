import { HighlightManager } from "../../quill/highlights/HighlightManager"
import { styles } from "../../quill/ui/quillStyles"

/**
 * Wrapper around quill, providing additional logic like the highlights
 */
export class QuillManager {
  constructor(onTextChange) {
    // callback called when quill content changes
    this.onTextChange = onTextChange

    // create highlight manager
    this.highlightManager = new HighlightManager(
      this.quill,
      this.numberAllocator
    )

    // listen for changes
    this.startListening()
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
   * Add a highlight for some field to some text
   */
  highlightText(index, length, fieldId) {
    this.highlightManager.highlightText(index, length, fieldId)
  }

  ///////////////
  // Rendering //
  ///////////////

  /**
   * Scrolls the first highlight element for the field into view
   */
  scrollHighlightIntoView(fieldId) {
    const fieldNumber = this.numberAllocator.getNumber(fieldId)
    let element = this.quillElement.querySelector(
      "." + styles["highlight-" + fieldNumber + "-yes"]
    )

    if (!element)
      return
      
    element.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })
  }
}