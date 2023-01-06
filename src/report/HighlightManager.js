import { allFieldNumbers } from "./quillStyles"

/**
 * Handles the highlighting functionality added to quill
 */
export class HighlightManager {
  static getHighlightFormats() {
    return allFieldNumbers.map(n => "highlight-" + n)
  }
  
  constructor(quill, numberAllocator) {
    this.quill = quill
    this.numberAllocator = numberAllocator
    this.isAnnotating = false
    this.activeFieldId = null

    this.quill.on("selection-change", this.onSelectionChange.bind(this))
  }

  /**
   * Sets whether the annotation mode is enabled or not
   */
  setIsAnnotating(isAnnotating) {
    this.isAnnotating = isAnnotating
  }

  /**
   * Sets the active field id
   */
  setActiveFieldId(activeFieldId) {
    this.activeFieldId = activeFieldId
  }

  /**
   * Called by quill on selection change
   */
  onSelectionChange(range, oldRange, source) {
    if (!this.isAnnotating)
      return

    if (!range)
      return

    if (range.length === 0)
      this.handleAnnotationClick(range.index)
    else
      this.handleAnnotationDrag(range.index, range.length)
  }

  handleAnnotationClick(index) {
    if (this.activeFieldId === null)
      return

    // clicking after the end of line does nothing
    if (this.quill.getText(index, 1) == "\n")
      return

    // clicking before the start of line does nothing
    if (this.quill.getText(index - 1, 1) == "\n")
      return

    // clicking before the start of text does nothing
    if (index == 0)
      return

    // delete the entire region
    let fieldNumber = this.numberAllocator.getNumber(this.activeFieldId)
    let from = this.followHighlightLeft(fieldNumber, index)
    let to = this.followHighlightRight(fieldNumber, index)

    // the click was not over any highlighted range
    if (from === to)
      return

    this.quill.formatText(from, to - from, {
      ["highlight-" + fieldNumber]: ""
    })
  }

  followHighlightRight(fieldNumber, startIndex) {
    let index = startIndex
    while (true) {
      if (this.quill.getText(index, 1) != "\n") {
        let format = this.quill.getFormat(index, 1)
        if (format["highlight-" + fieldNumber] !== "yes")
          break
      }
      index += 1
    }
    return index
  }

  followHighlightLeft(fieldNumber, startIndex) {
    let index = startIndex - 1
    while (true) {
      if (this.quill.getText(index, 1) != "\n") {
        let format = this.quill.getFormat(index, 1)
        if (format["highlight-" + fieldNumber] !== "yes")
          break
      }      
      index -= 1
    }
    return index + 1
  }

  handleAnnotationDrag(index, length) {
    if (this.activeFieldId === null)
      return
    
    // round the selection to words
    let from = this.getWordStartBefore(index)
    let to = this.getWordEndAfter(index + length)
    
    const fieldNumber = this.numberAllocator.getNumber(this.activeFieldId)
    this.quill.formatText(from, to - from, {
      ["highlight-" + fieldNumber]: "yes"
    })

    // silent source ensures that it doesn't
    // trigger the click event above
    this.quill.setSelection(to, 0, "silent")
  }

  getWordStartBefore(index) {
    const WINDOW = 50
    const text = this.quill.getText(index - WINDOW, WINDOW)
    for (let i = text.length - 1; i >= 0; i--) {
      if (!this.isWordChar(text[i])) {
        return index - text.length + i + 1
      }
    }
    return index - text.length
  }

  getWordEndAfter(index) {
    const WINDOW = 50
    const text = this.quill.getText(index, WINDOW)
    for (let i = 0; i < text.length; i++) {
      if (!this.isWordChar(text[i])) {
        return index + i
      }
    }
    return index + text.length - 1
  }

  isWordChar(char) {
    if (char == " " || char == "\n" || char == "\t" || char == "\r")
      return false
    return true
  }
}