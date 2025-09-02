import { atom, Getter, PrimitiveAtom, Setter, WritableAtom } from "jotai";

/**
 * Wraps a jotai atom and turns it into a signal atom.
 * Signal atom can be used to create atom dependencies with which we can
 * trigger atom recalculations whenever we signal the signal atom.
 */
export class SignalAtomWrapper {
  /**
   * The underlying atom that acts as the signal source
   */
  private readonly atom: WritableAtom<number, [], void> = atom(
    // when read, it must read the base atom to make the dependency
    (get) => get(this.baseAtom),

    // when set, increments the base atom to trigger child re-computation
    (get, set, _) => {
      let value = get(this.baseAtom);
      value = (value + 1) % 100;
      set(this.baseAtom, value);
    },
  );

  /**
   * The primitive atom underneath that's being modulo-incremented
   */
  private readonly baseAtom: PrimitiveAtom<number> = atom(0);

  /**
   * Call this method from inside the getter of another atom to subscribe
   */
  public subscribe(get: Getter) {
    get(this.atom);
  }

  /**
   * Call this method from a setter of an atom, or with a jotai store setter
   * to trigger the signal and cause subscriber recalculation.
   */
  public signal(set: Setter) {
    set(this.atom);
  }

  /**
   * Returns the signal atom behind this signal atom wrapper
   */
  public getSignalAtom(): WritableAtom<number, [], void> {
    return this.atom;
  }
}
