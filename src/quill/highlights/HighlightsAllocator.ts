/**
 * Text highlights for individual form fields are implemented by having
 * a set of pre-defined, numbered formatting styles, that are then
 * allocated dynamically to form field IDs. This class handles the
 * mapping between highlight numbers (int) and form field IDs (string).
 */
export class HighlightsAllocator {
  /**
   * All highlight numbers that are defined in the stylesheet
   * and that are registered to the Quill library.
   * Basically defines the allocated universe.
   */
  private readonly allNumbers: Set<number>;

  /**
   * Which highlight numbers have not yet been allocated.
   * (are free to be allocated)
   */
  private freeNumbers: Set<number>;

  /**
   * Form field IDs that were already allocated
   * (to prevent double-allocation of one field)
   */
  private knownIds: Set<string>;

  /**
   * Mapping from highlight numbers to field IDs
   * (for allocated pairs)
   */
  private numberToId: Map<number, string>;

  /**
   * Mapping from field IDs to highlight numbers
   * (for allocated pairs)
   */
  private idToNumber: Map<string, number>;

  constructor(allNumbers: number[]) {
    this.allNumbers = new Set<number>(allNumbers);

    this.freeNumbers = new Set<number>(allNumbers);
    this.knownIds = new Set<string>();

    this.numberToId = new Map<number, string>();
    this.idToNumber = new Map<string, number>();
  }

  /**
   * Constructs a visualization of highlights
   * ID mapping for debugging purposes
   */
  public renderHighlightIdMap(): string {
    let text = "";
    for (let k of this.idToNumber.keys()) {
      text += k + " => " + this.idToNumber.get(k) + "\n";
    }
    return text;
  }

  //////////////////////////
  // Managing allocations //
  //////////////////////////

  /**
   * Resets the allocator to the empty state
   */
  public reset(): void {
    this.freeNumbers = new Set<number>(this.allNumbers);
    this.knownIds = new Set<string>();

    this.numberToId = new Map<number, string>();
    this.idToNumber = new Map<string, number>();
  }

  /**
   * Allocates a highlight number number for a new field ID
   */
  private allocateNew(fieldId: string): void {
    if (this.freeNumbers.size === 0)
      throw new Error("HighlightsAllocator has run out of numbers.");

    if (this.knownIds.has(fieldId))
      throw new Error("The field ID has already been allocated: " + fieldId);

    const highlightNumber: number = this.freeNumbers.values().next().value;

    this.numberToId.set(highlightNumber, fieldId);
    this.idToNumber.set(fieldId, highlightNumber);

    this.knownIds.add(fieldId);
    this.freeNumbers.delete(highlightNumber);
  }

  /**
   * Unallocates all field IDs that are missing from the given array
   * @param {*} keepIds Field IDs to keep (actually used IDs)
   */
  public releaseUnlistedIds(idsToKeep: Iterable<string>): void {
    const idSetToKeep = new Set(idsToKeep);
    const idsToRemove = [...this.knownIds].filter((id) => !idSetToKeep.has(id));

    for (const fieldId of idsToRemove) {
      const highlightNumber = this.idToNumber.get(fieldId);

      if (highlightNumber === undefined) {
        throw Error(
          `The field ID ${fieldId} is known, but missing from ` +
            `the map. This breaks allocator invariants.`,
        );
      }

      this.idToNumber.delete(fieldId);
      this.numberToId.delete(highlightNumber);

      this.knownIds.delete(fieldId);
      this.freeNumbers.add(highlightNumber);
    }
  }

  /////////////////////////
  // Reading allocations //
  /////////////////////////

  /**
   * Resolves the highlight number for a given field ID
   */
  public getHighlightNumber(fieldId: string): number {
    if (!this.idToNumber.has(fieldId)) {
      this.allocateNew(fieldId);
    }
    return this.idToNumber.get(fieldId)!;
  }

  /**
   * Resolves the field ID of an already allocated highlight number
   */
  public getFieldId(highlightNumber: number): string {
    if (!this.numberToId.has(highlightNumber)) {
      throw new Error(
        "The highlight number has not been allocated yet: " + highlightNumber,
      );
    }
    return this.numberToId.get(highlightNumber)!;
  }
}
