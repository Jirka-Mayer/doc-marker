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

  scrollHighlightIntoView(fieldId) {
    const highlightNumber = this.highlightsAllocator.getNumber(fieldId)
    let element = this.quillElement.querySelector(
      "." + styles[`highlight-${highlightNumber}-yes`]
    )

    if (!element)
      return
      
    element.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })
  }
}