// what value and prefix do highlights have in deltas outside the quill instance
const DELTA_HIGHLIGHT_ID_PREFIX = "highlight://"
const DELTA_HIGHLIGHT_ID_VALUE = true

// what value and prefix do highlights have in deltas inside the quill instance
const DELTA_HIGHLIGHT_NUMBER_PREFIX = "highlight-"
const DELTA_HIGHLIGHT_NUMBER_VALUE = "yes"

/**
 * Allocates field numbers (available CSS classes) to given field IDs
 * for the highlighting system
 */
export class FieldNumberAllocator {
  constructor(allNumbers) {
    this.allNumbers = new Set(allNumbers)
    this.freeNumbers = new Set(allNumbers)
    this.knownIds = new Set()
    
    this.numberToId = new Map()
    this.idToNumber = new Map()
  }

  /**
   * Allocates a number for a new field ID
   */
  allocateNew(id) {
    if (this.freeNumbers.size === 0) {
      throw new Error(
        "FieldNumberAllocator has run out of numbers. " +
        "Increate the their count in the scss style sheet."
      )
    }

    if (this.knownIds.has(id)) {
      throw new Error(
        "The ID has already been allocated: " + id
      )
    }

    const number = this.freeNumbers.values().next().value

    this.numberToId.set(number, id)
    this.idToNumber.set(id, number)
    
    this.knownIds.add(id)
    this.freeNumbers.delete(number)
  }

  /////////////////
  // Primary API //
  /////////////////

  /**
   * Resolves the field number for a given field ID
   */
  getNumber(id) {
    if (!this.idToNumber.has(id)) {
      this.allocateNew(id)
    }
    return this.idToNumber.get(id)
  }

  /**
   * Resolves the field ID of an already allocated field number
   */
  getId(number) {
    if (!this.numberToId.has(number)) {
      throw new Error(
        "The number has not been assigned: " + number
      )
    }
    return this.numberToId.get(number)
  }

  ///////////////////////
  // Delta Conversions //
  ///////////////////////

  /**
   * Converts ID-based quill delta to number-based quill delta
   */
  deltaToNumbers(delta) {
    return this.mapDeltaAttributes(
      delta,
      (key, value) => {
        if (key.indexOf(DELTA_HIGHLIGHT_ID_PREFIX) === 0) {
          return [
            DELTA_HIGHLIGHT_NUMBER_PREFIX
              + this.getNumber(key.substring(DELTA_HIGHLIGHT_ID_PREFIX.length)),
            DELTA_HIGHLIGHT_NUMBER_VALUE
          ]
        }
        return [key, value]
      }
    )
  }

  /**
   * Converts number-based quill delta to ID-based quill delta
   */
  deltaToIds(delta) {
    return this.mapDeltaAttributes(
      delta,
      (key, value) => {
        if (key.indexOf(DELTA_HIGHLIGHT_NUMBER_PREFIX) === 0) {
          return [
            DELTA_HIGHLIGHT_ID_PREFIX
              + this.getId(key.substring(DELTA_HIGHLIGHT_NUMBER_PREFIX.length)),
            DELTA_HIGHLIGHT_ID_VALUE
          ]
        }
        return [key, value]
      }
    )
  }

  mapDeltaAttributes(delta, fn) {
    function mapAttributes(attributes) {
      let outAttributes = {}
      for (let key in attributes) {
        let [newKey, newValue] = fn(key, attributes[key])
        outAttributes[newKey] = newValue
      }
      return outAttributes
    }
    
    return {
      ops: delta.ops.map(op => !op.attributes ? op : {
        ...op,
        attributes: mapAttributes(op.attributes)
      })
    }
  }
}