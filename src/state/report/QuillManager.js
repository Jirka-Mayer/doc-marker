import { HighlightManager } from "../../quill/highlights/HighlightManager"
import { styles } from "../../quill/ui/quillStyles"

export class QuillManager {
  constructor() {
    this.highlightManager = new HighlightManager(
      this.quill,
      this.numberAllocator
    )
  }

  /**
   * Add a highlight for some field to some text
   */
  highlightText(index, length, fieldId) {
    this.highlightManager.highlightText(index, length, fieldId)
  }

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