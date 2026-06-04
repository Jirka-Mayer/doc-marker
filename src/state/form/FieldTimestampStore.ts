import { atom } from "jotai";
import { AtomGroup } from "../AtomGroup";
import { FieldsRepository } from "./FieldsRepository";
import { JotaiStore } from "../JotaiStore";

/**
 * Store that holds last-modified-at timestamps for individual form fields.
 *
 * Note that this store ignores undo/redo. They are considered as any other
 * user-initiated modifications of the field. Similarly, robot-initiated
 * modifications also update the timestamp value.
 */
export class FieldTimestampStore {
  private readonly jotaiStore: JotaiStore;
  private readonly fieldsRepository: FieldsRepository;

  /**
   * One atom for each form field, that holds the last modified at
   * timestamp. It may also hold "null", which means it is unknown
   * when the field was last modified, or it may have never been
   * modified at all (for empty fields in a new file).
   */
  public readonly timestampAtoms = new AtomGroup((fieldId: string) =>
    atom<Date | null>(null),
  );

  constructor(jotaiStore: JotaiStore, fieldsRepository: FieldsRepository) {
    this.jotaiStore = jotaiStore;
    this.fieldsRepository = fieldsRepository;

    // listen for changes in the field's state
    this.fieldsRepository.onChange.subscribe((e) => {
      // listen only for update events (skip creation and deletion
      // as those concern file-loading-related field modifications)
      if (e.type === "update") {
        // check that the value did in fact change
        // (i.e. ignore field visibility changes)
        if (e.oldFieldState!.data !== e.newFieldState!.data) {
          this.onFieldModifiedByUser(e.fieldId);
        }
      }
    });
  }

  /**
   * Method invoked whenever a field value is changed by the user
   * by interacting with the UI, not by openning/loading a file.
   */
  private onFieldModifiedByUser(fieldId: string): void {
    console.log(
      "UPDATE:",
      fieldId,
      this.fieldsRepository.fields.get(fieldId)?.exportedData,
    );

    // update the field's timestamp
    this.jotaiStore.set(this.timestampAtoms.get(fieldId), new Date());
  }

  /**
   * Forgets all timestamp information for all fields
   */
  public clearAllTimestamps(): void {
    for (let fieldId of this.timestampAtoms.keys()) {
      this.jotaiStore.set(this.timestampAtoms.get(fieldId), null);
    }
  }

  /**
   * Serializes timestamps into a JSON dictionary
   * according to the serialized file format
   */
  public serialize(): { [fieldId: string]: string } {
    const data: { [fieldId: string]: string } = {};

    for (let field of this.fieldsRepository.fields.values()) {
      // serialize only visible fields
      if (!field.visible) {
        continue;
      }

      // write the timestamp if not null
      const timestamp = this.jotaiStore.get(
        this.timestampAtoms.get(field.fieldId),
      );
      if (timestamp !== null) {
        data[field.fieldId] = timestamp.toISOString();
      }
    }

    return data;
  }

  /**
   * Loads the state from a serialized JSON file
   */
  public deserialize(data?: { [fieldId: string]: string }): void {
    this.clearAllTimestamps();

    if (data === undefined) {
      return;
    }

    for (let fieldId of Object.keys(data)) {
      const timestamp = new Date(data[fieldId]);
      this.jotaiStore.set(this.timestampAtoms.get(fieldId), timestamp);
    }
  }
}
