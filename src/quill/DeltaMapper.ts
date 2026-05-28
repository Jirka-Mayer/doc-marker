import { QDelta, QOperation, isDelete, QAttributes } from "./QDelta";
import { HighlightsAllocator } from "./highlights/HighlightsAllocator";

/**
 * The QuillExtended API works with Delta values that are slightly
 * different to the internal Delta values used by the internal Quill
 * instance. This service is responsible for the mapping between
 * these two Delta formats. This mapping is mainly done because
 * of the allocation of highlight formats to field IDs.
 */
export class DeltaMapper {
  /**
   * Service responsible for allocating available
   * highlight numbers to field IDs
   */
  private highlightsAllocator: HighlightsAllocator;

  constructor(highlightsAllocator: HighlightsAllocator) {
    this.highlightsAllocator = highlightsAllocator;
  }

  ///////////////
  // Exporting //
  ///////////////

  /**
   * Converts internal representation delta to the external representation delta
   */
  public exportDelta(internalDelta: QDelta): QDelta {
    return mapDeltaAttributes(internalDelta, (k, v) =>
      this.exportAttribute(k, v),
    );
  }

  /**
   * Converts internal representation attributes object (the object returned
   * by getFormat) to the external representation attributes object
   */
  public exportAttributesObject(attributesObject: QAttributes): QAttributes {
    return mapAttributesObject(attributesObject, (k, v) =>
      this.exportAttribute(k, v),
    );
  }

  /**
   * Converts internal key value attribute pair (format and its value) to
   * the external representation of that pair
   */
  public exportAttribute(
    key: string,
    value: any,
  ): [newKey: string, newValue: any] {
    if (this.isInternalHighlightAttribute(key)) {
      return this.exportHighlightAttribute(key, value);
    }

    return [key, value];
  }

  ///////////////
  // Importing //
  ///////////////

  /**
   * Converts external representation delta to the internal representation delta
   */
  public importDelta(externalDelta: QDelta): QDelta {
    return mapDeltaAttributes(externalDelta, (k, v) =>
      this.importAttribute(k, v),
    );
  }

  /**
   * Converts external representation attributes object (the object returned
   * by getFormat) to the internal representation attributes object
   */
  public importAttributesObject(attributesObject: QAttributes): QAttributes {
    return mapAttributesObject(attributesObject, (k, v) =>
      this.importAttribute(k, v),
    );
  }

  /**
   * Converts external key value attribute pair (format and its value) to
   * the internal representation of that pair
   */
  public importAttribute(
    key: string,
    value: any,
  ): [newKey: string, newValue: any] {
    if (this.isExternalHighlightAttribute(key)) {
      return this.importHighlightAttribute(key, value);
    }

    return [key, value];
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

  // constants used during highlights mapping
  private static highlights = {
    externalPrefix: "highlighted@",
    externalValue: true,
    externalMissingValue: false,
    internalPrefix: "highlight-",
    internalValue: "yes",
    internalMissingValue: "",
  };

  private isExternalHighlightAttribute(externalKey: string): boolean {
    // does the key start with the "highlighted@" prefix?
    return (
      (externalKey || "").indexOf(DeltaMapper.highlights.externalPrefix) === 0
    );
  }

  private isInternalHighlightAttribute(internalKey: string): boolean {
    // does the key start with the "highlight-" prefix?
    return (
      (internalKey || "").indexOf(DeltaMapper.highlights.internalPrefix) === 0
    );
  }

  private exportHighlightAttribute(
    internalKey: string,
    internalValue: any,
  ): [externalKey: string, externalValue: any] {
    const externalValue =
      internalValue === DeltaMapper.highlights.internalValue
        ? DeltaMapper.highlights.externalValue
        : DeltaMapper.highlights.externalMissingValue;
    const number = parseInt(
      internalKey.substring(DeltaMapper.highlights.internalPrefix.length),
    );
    const id = this.highlightsAllocator.getFieldId(number);
    const externalKey = DeltaMapper.highlights.externalPrefix + id;
    return [externalKey, externalValue];
  }

  private importHighlightAttribute(
    externalKey: string,
    externalValue: any,
  ): [internalKey: string, internalValue: any] {
    const internalValue =
      externalValue === DeltaMapper.highlights.externalValue
        ? DeltaMapper.highlights.internalValue
        : DeltaMapper.highlights.internalMissingValue;
    const id = externalKey.substring(
      DeltaMapper.highlights.externalPrefix.length,
    );
    const number = this.highlightsAllocator.getHighlightNumber(id);
    const internalKey =
      DeltaMapper.highlights.internalPrefix + number.toString();
    return [internalKey, internalValue];
  }
}

////////////////////////
// Functional helpers //
////////////////////////

/**
 * Type signature of a function that maps QAttribute key-value pairs
 */
type AttributeMapFunction = (
  key: string,
  value: any,
) => [newKey: string, newValue: any];

/**
 * Maps all QAttributes objects on all operations of the given QDelta.
 * Returns a new Delta instance.
 */
function mapDeltaAttributes(
  delta: QDelta,
  mapFunction: AttributeMapFunction,
): QDelta {
  return {
    // map all operations
    ops: delta.ops.map((op: QOperation) => {
      // operation has no attributes to be mapped
      if (isDelete(op) || op.attributes === undefined) {
        return op;
      }

      // operation does have attributes to be mapped
      return {
        ...op,
        attributes: mapAttributesObject(op.attributes, mapFunction),
      };
    }),
  };
}

/**
 * Maps the QAttributes object with the given attribute mapping function.
 * Returns a new QAttributes instance.
 */
function mapAttributesObject(
  attributes: QAttributes,
  mapFunction: AttributeMapFunction,
): QAttributes {
  const mappedAttributes: QAttributes = {};

  for (const key in attributes) {
    const [newKey, newValue] = mapFunction(key, attributes[key]);
    mappedAttributes[newKey] = newValue;
  }

  return mappedAttributes;
}
