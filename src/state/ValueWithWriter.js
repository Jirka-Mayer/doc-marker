/**
 * Lets you set an atom with metadata about the writer of the new state.
 * NOTE: The target atom has to support this value type!
 */
export class ValueWithWriter {
  constructor(value, writer) {
    this.value = value
    this.writer = writer
  }

  static unwrap(value) {
    if (value instanceof ValueWithWriter) {
      return [value.value, value.writer]
    } else {
      return [value, undefined]
    }
  }
}