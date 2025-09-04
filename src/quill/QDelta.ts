/**
 * Represents the Quill's Delta data format, but instead of using the
 * Delta class from the quill-delta package, this describes the raw JSON
 * objects and values handled in DocMarker (outside of Quill itself).
 * Consider this the "Serialized Delta", but to shorten the name I use QDelta.
 * Having a separate definition here also allows us to decouple the internal
 * data of DocMarker from any changes to Quill's Delta, should those happen
 * in the future.
 */
export interface QDelta {
  /**
   * List of text operations that are to be performed in their order
   */
  ops: QOperation[];
}

/**
 * An operation from the Quill Delta format
 */
export type QOperation = QInsertOp | QInsertEmbedOp | QDeleteOp | QRetainOp;

export function isInsert(op: QOperation): op is QInsertOp {
  return typeof (op as QInsertOp).insert === "string";
}

export function isInsertEmbed(op: QOperation): op is QInsertEmbedOp {
  const x = (op as QInsertEmbedOp).insert as any;
  return typeof x === "object" && !Array.isArray(x) && x !== null;
}

export function isDelete(op: QOperation): op is QDeleteOp {
  return typeof (op as QDeleteOp).delete === "number";
}

export function isRetain(op: QOperation): op is QRetainOp {
  return typeof (op as QRetainOp).retain === "number";
}

/**
 * Operation to insert text
 */
export interface QInsertOp {
  /**
   * The text to be inserted
   */
  insert: string;

  /**
   * Optional attributes on the text
   */
  attributes?: QAttributes;
}

/**
 * Operation to insert an embed
 */
export interface QInsertEmbedOp {
  /**
   * The embed to be inserted
   */
  insert: {
    [embedProperty: string]: any;
  };

  /**
   * Optional attributes on the embed
   */
  attributes?: QAttributes;
}

/**
 * Operation to delete text (and/or embeds)
 */
export interface QDeleteOp {
  /**
   * How many characters to delete
   */
  delete: number;
}

/**
 * Operation to skip or, or format a text range
 */
export interface QRetainOp {
  /**
   * How many characters to skip over (or format)
   */
  retain: number;

  /**
   * Optional attributes to set to the retained text
   */
  attributes?: QAttributes;
}

/**
 * Attributes that may be present on a delta operation
 */
export type QAttributes = {
  [attribute: string]: any;
};
