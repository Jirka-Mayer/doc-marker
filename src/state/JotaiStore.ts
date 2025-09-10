import { Atom, WritableAtom } from "jotai";

/**
 * Jotai does not expose the "Store" type (yet) but we need it for type
 * annotations, so here's a placeholder with the same definition.
 */
export type JotaiStore = {
  get: <Value>(atom: Atom<Value>) => Value;
  set: <Value, Args extends unknown[], Result>(
    atom: WritableAtom<Value, Args, Result>,
    ...args: Args
  ) => Result;
  sub: (atom: Atom<unknown>, listener: () => void) => () => void;
};
