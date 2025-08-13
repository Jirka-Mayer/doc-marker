import { Atom, atom, PrimitiveAtom } from "jotai";
import { JotaiStore } from "../JotaiStore";

/**
 * Holds metadata about the currently openned file.
 *
 * Explainer:
 * When a file is loaded, its data is distributed into state stores (e.g. the
 * report, the form). This store holds all the metadata about the file,
 * such as the name, timestamps, UUID etc., otherwise these would
 * be forgotten should the file be saved again.
 */
export class FileMetadataStore {
  private readonly jotaiStore: JotaiStore;

  constructor(jotaiStore: JotaiStore) {
    this.jotaiStore = jotaiStore;
  }

  /////////////////////////////////////
  // Jotai atoms that hold the state //
  /////////////////////////////////////

  /**
   * The UUID of the currently open file or null if no file is open
   */
  public readonly fileUuidAtom: PrimitiveAtom<string | null> = atom(null);

  /**
   * True if a file is currently open
   * (read-only atom, computed from the UUID atom)
   */
  public readonly isFileOpenAtom: Atom<boolean> = atom(
    (get) => get(this.fileUuidAtom) !== null,
  );

  /**
   * Holds the user-specified file name
   */
  public readonly fileNameAtom: PrimitiveAtom<string> = atom("");

  /**
   * When was the openned file created, as a Date instance.
   * Null if no file is open.
   */
  public readonly fileCreatedAtAtom: PrimitiveAtom<Date | null> = atom(null);

  //////////////////////////////////
  // Vanilla JS API for the state //
  //////////////////////////////////

  /**
   * The UUID of the currently open file or null if no file is open
   */
  public get fileUuid(): string | null {
    return this.jotaiStore.get(this.fileUuidAtom);
  }

  public set fileUuid(value: string | null) {
    this.jotaiStore.set(this.fileUuidAtom, value);
  }

  /**
   * True if there is a file currently open
   */
  public get isFileOpen(): boolean {
    return this.jotaiStore.get(this.isFileOpenAtom);
  }

  /**
   * The user-specified, human-readable file name
   */
  public get fileName(): string {
    return this.jotaiStore.get(this.fileNameAtom);
  }

  public set fileName(value: string) {
    this.jotaiStore.set(this.fileNameAtom, value);
  }

  /**
   * When was the openned file created, as a Date instance.
   * Throws an error if no file is open.
   */
  public get fileCreatedAt(): Date {
    const timestamp = this.jotaiStore.get(this.fileCreatedAtAtom);

    if (timestamp === null) {
      throw new Error(
        "File creation timestamp is unknown, likely no file is open.",
      );
    }

    return timestamp;
  }

  public set fileCreatedAt(value: Date) {
    this.jotaiStore.set(this.fileCreatedAtAtom, value);
  }
}
