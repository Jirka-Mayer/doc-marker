import { IdToNumberAllocator } from "./utils/IdToNumberAllocator"
import { mapDeltaAttributes } from "./utils/mapDeltaAttributes"

/**
 * Provides delta-mapping functionality for the extended quill specifically
 */
export class DeltaMapper {
  constructor(highlightsAllocator) {
    /** @type {IdToNumberAllocator} */
    this.highlightsAllocator = highlightsAllocator
  }

  /**
   * Converts internal representation delta to the external representation delta
   */
  export(internalDelta) {
    const externalDelta = mapDeltaAttributes(
      internalDelta,
      (key, value) => {
        if (this.isInternalHighlightAttribute(key))
          return this.exportHighlightAttribute(key, value)
      
        return [key, value]
      }
    )

    return externalDelta
  }

  /**
   * Converts external representation delta to the internal representation delta
   */
  import(externalDelta) {
    const internalDelta = mapDeltaAttributes(
      externalDelta,
      (key, value) => {
        if (this.isExternalHighlightAttribute(key))
          return this.exportHighlightAttribute(key, value)

        return [key, value]
      }
    )

    return internalDelta
  }


  ////////////////
  // Highlights //
  ////////////////

  /*
   * External attribute:
   * "highlighted@foo.bar": true
   * 
   * Internal attribute:
   * "highlight-4": "yes"
   */

  static highlights = {
    externalPrefix: "highlighted@",
    externalValue: true,
    externalMissingValue: false,
    internalPrefix: "highlight-",
    internalValue: "yes",
    internalMissingValue: ""
  }

  isExternalHighlightAttribute(externalKey) {
    // does the key start with the "highlighted@" prefix?
    return (externalKey || "").indexOf(DeltaMapper.highlights.externalPrefix) === 0
  }

  isInternalHighlightAttribute(internalKey) {
    // does the key start with the "highlight-" prefix?
    return (internalKey || "").indexOf(DeltaMapper.highlights.internalPrefix) === 0
  }

  exportHighlightAttribute(internalKey, internalValue) {
    const externalValue = internalValue === DeltaMapper.highlights.internalValue
      ? DeltaMapper.highlights.externalValue
      : DeltaMapper.highlights.externalMissingValue
    const number = internalKey.substring(DeltaMapper.highlights.internalPrefix.length)
    const id = this.highlightsAllocator.getId(number)
    const externalKey = DeltaMapper.highlights.externalPrefix + id
    return [externalKey, externalValue]
  }

  importHighlightAttribute(externalKey, externalValue) {
    const internalValue = externalValue === DeltaMapper.highlights.externalValue
      ? DeltaMapper.highlights.internalValue
      : DeltaMapper.highlights.internalMissingValue
    const id = externalKey.substring(DeltaMapper.highlights.externalPrefix.length)
    const number = this.highlightsAllocator.getNumber(id)
    const internalKey = DeltaMapper.highlights.internalPrefix + number
    return [internalKey, internalValue]
  }
}