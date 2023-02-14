import { getInlineFormatRange } from "./utils/getInlineFormatRange"

/**
 * Contains the logic behind the extended anonymization quill API
 */
export class AnonymizationApi {
  constructor(quill, quillElement) {
    this.quill = quill

    /** @type {HTMLDivElement} */
    this.quillElement = quillElement
  }

  /**
   * Anonymizes (or removes anonymization) for a given data kind in a given range
   * @param {number} index Range start
   * @param {number} length Range length
   * @param {string} kindId Kind of the anonymized data
   * @param {string} source Who triggered the update (quill source)
   */
   anonymizeText(index, length, kindId = "", source = "api") {
    this.quill.formatText(index, length, {
      ["anonymized"]: kindId
    }, source)
  }

  getAnonymizedRange(index) {
    const value = this.quill.getFormat(index)["anonymized"]
    
    if (!value)
      return null

    return getInlineFormatRange(this.quill, index, "anonymized", value)
  }
}