/**
 * Allocates numbers (e.g. available CSS classes) to given string IDs
 * (e.g. field IDs for the highlighting system)
 */
export class IdToNumberAllocator {
  constructor(allNumbers) {
    this.allNumbers = new Set(allNumbers)
    this.freeNumbers = new Set(allNumbers)
    this.knownIds = new Set()
    
    this.numberToId = new Map()
    this.idToNumber = new Map()
  }

  /**
   * Resets the allocator to the empty state
   */
  reset() {
    this.freeNumbers = new Set(this.allNumbers)
    this.knownIds = new Set()
    
    this.numberToId = new Map()
    this.idToNumber = new Map()
  }

  /**
   * Allocates a number for a new ID
   */
  allocateNew(id) {
    if (this.freeNumbers.size === 0)
      throw new Error("IdToNumberAllocator has run out of numbers.")

    if (this.knownIds.has(id))
      throw new Error("The ID has already been allocated: " + id)

    const number = this.freeNumbers.values().next().value

    this.numberToId.set(number, id)
    this.idToNumber.set(id, number)
    
    this.knownIds.add(id)
    this.freeNumbers.delete(number)
  }

  /**
   * Frees up unused IDs, if the given array contains all the used IDs
   * @param {*} keepIds IDs to keep (used IDs)
   */
  releaseUnlistedIds(keepIds) {
    keepIds = new Set(keepIds)
    const removeIds = [...this.knownIds].filter(id => !keepIds.has(id))

    for (const id of removeIds) {
      const number = this.idToNumber.get(id)
      
      this.idToNumber.delete(id)
      this.numberToId.delete(number)

      this.knownIds.delete(id)
      this.freeNumbers.add(number)
    }
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
      throw new Error("The number has not been assigned: " + number)
    }
    return this.numberToId.get(number)
  }
}