import { IdToNumberAllocator } from "./utils/IdToNumberAllocator"
import { styles } from "./ui/quillStyles"
import { getInlineFormatRange } from "./utils/getInlineFormatRange"

/**
 * Contains the logic behind the extended highlights quill API
 */
export class HighlightsApi {
  constructor(quill, quillElement, highlightsAllocator) {
    this.quill = quill

    /** @type {HTMLDivElement} */
    this.quillElement = quillElement

    /** @type {IdToNumberAllocator} */
    this.highlightsAllocator = highlightsAllocator

    // scroll into view state
    this.lastScrollIntoViewFieldId = null
    this.lastScrollIntoViewElementIndex = -1
  }

  /**
   * Highlights (or removes highlight) for a given field in a given range
   * @param {number} index Range start
   * @param {number} length Range length
   * @param {string} fieldId ID of the form field
   * @param {boolean} highlighted Set false to remove highlight for the field
   * @param {string} source Who triggered the update (quill source)
   */
  highlightText(index, length, fieldId, highlighted = true, source = "api") {
    const highlightNumber = this.highlightsAllocator.getNumber(fieldId)
    this.quill.formatText(index, length, {
      ["highlight-" + highlightNumber]: highlighted ? "yes" : ""
    }, source)
  }

  getHighlightRange(index, fieldId) {
    const highlightNumber = this.highlightsAllocator.getNumber(fieldId)
    return getInlineFormatRange(
      this.quill,
      index,
      "highlight-" + highlightNumber,
      "yes"
    )
  }

  /**
   * Scrolls the first highlight for the given fieldId into view.
   * If there are multiple highlights, then calling this function
   * repeatedly loops over them.
   */
  scrollHighlightIntoView(fieldId) {
    // get highlight span elements
    const highlightNumber = this.highlightsAllocator.getNumber(fieldId)
    let elements = Array.from(this.quillElement.querySelectorAll(
      "." + styles[`highlight-${highlightNumber}-yes`]
    ))

    if (elements.length === 0) {
      return
    }

    // "group" elements that are close together
    // (by removing those that are too close)
    let position = elements[0].getBoundingClientRect().top
    let threshold = 100 // pixels
    for (let i = 1; i < elements.length; i++) {
      let p = elements[i].getBoundingClientRect().top
      if (p < position + threshold) {
        elements.splice(i, 1)
        i -= 1
      } else {
        position = p
      }
    }

    // get the next element index to sroll to
    let index = 0
    if (this.lastScrollIntoViewFieldId === fieldId) {
      index = (this.lastScrollIntoViewElementIndex + 1) % elements.length
    }

    // store the state
    this.lastScrollIntoViewFieldId = fieldId
    this.lastScrollIntoViewElementIndex = index
    
    // scroll
    elements[index].scrollIntoView({
      behavior: "smooth",
      block: "center"
    })
  }
}