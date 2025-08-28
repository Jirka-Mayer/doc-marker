import { JotaiStore } from "./JotaiStore";

/**
 * A dictionary of atoms that can be accessed by some key
 */
export class AtomGroup<TAtom> {
  private jotaiStore: JotaiStore;

  private readonly atoms: { [key: string]: TAtom } = {};
  private readonly atomFactory: (key: string) => TAtom;

  constructor(atomFactory: (key: string) => TAtom, jotaiStore: JotaiStore) {
    this.jotaiStore = jotaiStore;
    this.atomFactory = atomFactory;
  }

  /**
   * Retrieves (or creates) an atom for the given key
   */
  public get(key: string): TAtom {
    if (!this.atoms.hasOwnProperty(key)) {
      this.atoms[key] = this.atomFactory(key);
    }
    return this.atoms[key];
  }

  /**
   * Returns all keys for the existing atoms
   */
  public keys(): string[] {
    return Object.keys(this.atoms);
  }
}
