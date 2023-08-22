import { IdToNumberAllocator } from "./utils/IdToNumberAllocator"
import { mapDeltaAttributes, mapAttributesObject } from "./utils/mapDeltaAttributes"

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
  exportDelta(internalDelta) {
    return mapDeltaAttributes(
      internalDelta,
      this.exportAttribute.bind(this)
    )
  }

  /**
   * Converts internal representation attributes object (the object returned
   * by getFormat) to the external representation attributes object
   */
  exportAttributesObject(attributesObject) {
    return mapAttributesObject(
      attributesObject,
      this.exportAttribute.bind(this)
    )
  }

  /**
   * Converts internal key value attribute pair (format and its value) to
   * the external representation of that pair
   */
  exportAttribute(key, value) {
    if (this.isInternalHighlightAttribute(key))
      return this.exportHighlightAttribute(key, value)
  
    return [key, value]
  }

  /**
   * Converts external representation delta to the internal representation delta
   */
  importDelta(externalDelta) {
    return mapDeltaAttributes(
      externalDelta,
      this.importAttribute.bind(this)
    )
  }

  /**
   * Converts external representation attributes object (the object returned
   * by getFormat) to the internal representation attributes object
   */
  importAttributesObject(attributesObject) {
    return mapAttributesObject(
      attributesObject,
      this.importAttribute.bind(this)
    )
  }

  /**
   * Converts external key value attribute pair (format and its value) to
   * the internal representation of that pair
   */
  importAttribute(key, value) {
    if (this.isExternalHighlightAttribute(key))
      return this.importHighlightAttribute(key, value)

    return [key, value]
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