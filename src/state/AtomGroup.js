/**
 * A dictionary of atoms that can be accessed by some key
 */
export class AtomGroup {
  constructor(atomFactory) {
    this.atoms = {}
    this.atomFactory = atomFactory
  }

  /**
   * Retrieves (or creates) an atom for the given key
   */
  get(key) {
    if (!this.atoms.hasOwnProperty(key)) {
      this.atoms[key] = this.atomFactory(key)
    }
    return this.atoms[key]
  }
}