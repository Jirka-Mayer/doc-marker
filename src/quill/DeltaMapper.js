import { IdToNumberAllocator } from "./utils/IdToNumberAllocator"
import { mapDeltaAttributes } from "./utils/mapDeltaAttributes"

/**
 * Provides delta-mapping functionality for the extended quill specifically
 */
export class DeltaMapper {
  constructor(highlightsAllocator, anonymizationsAllocator) {
    /** @type {IdToNumberAllocator} */
    this.highlightsAllocator = highlightsAllocator
    
    /** @type {IdToNumberAllocator} */
    this.anonymizationsAllocator = anonymizationsAllocator
  }

  /**
   * Converts internal representation delta to the external representation delta
   */
  export(internalDelta) {
    const externalDelta = mapDeltaAttributes(
      internalDelta,
      (key, value) => {
        if (this.isInternalAnonymizationAttribute(key))
          return this.exportAnonymizationAttribute(key, value)

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
        if (this.isExternalAnonymizationAttribute(key))
          return this.exportAnonymizationAttribute(key, value)

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
   * "highlight://#/properties/foo/properties/bar": true
   * 
   * Internal attribute:
   * "highlight-4": "yes"
   */

  static highlights = {
    externalPrefix: "highlight://",
    externalValue: true,
    externalMissingValue: false,
    internalPrefix: "highlight-",
    internalValue: "yes",
    internalMissingValue: ""
  }

  isExternalHighlightAttribute(externalKey) {
    // does the key start with the "highlight://" prefix?
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


  ////////////////////
  // Anonymizations //
  ////////////////////

  /*
   * External attribute:
   * "anonymization://foo.bar": true
   * 
   * Internal attribute:
   * "anonymization-7": "yes"
   */

  static anonymizations = {
    externalPrefix: "anonymization://",
    externalValue: true,
    externalMissingValue: false,
    internalPrefix: "anonymization-",
    internalValue: "yes",
    internalMissingValue: ""
  }

  isExternalAnonymizationAttribute(externalKey) {
    // does the key start with the "anonymization://" prefix?
    return (externalKey || "").indexOf(DeltaMapper.anonymizations.externalPrefix) === 0
  }

  isInternalAnonymizationAttribute(internalKey) {
    // does the key start with the "anonymization-" prefix?
    return (internalKey || "").indexOf(DeltaMapper.anonymizations.internalPrefix) === 0
  }

  exportAnonymizationAttribute(internalKey, internalValue) {
    const externalValue = internalValue === DeltaMapper.anonymizations.internalValue
      ? DeltaMapper.anonymizations.externalValue
      : DeltaMapper.anonymizations.externalMissingValue
    const number = internalKey.substring(DeltaMapper.anonymizations.internalPrefix.length)
    const id = this.anonymizationsAllocator.getId(number)
    const externalKey = DeltaMapper.anonymizations.externalPrefix + id
    return [externalKey, externalValue]
  }

  importAnonymizationAttribute(externalKey, externalValue) {
    const internalValue = externalValue === DeltaMapper.anonymizations.externalValue
      ? DeltaMapper.anonymizations.internalValue
      : DeltaMapper.anonymizations.internalMissingValue
    const id = externalKey.substring(DeltaMapper.anonymizations.externalPrefix.length)
    const number = this.anonymizationsAllocator.getNumber(id)
    const internalKey = DeltaMapper.anonymizations.internalPrefix + number
    return [internalKey, internalValue]
  }
}