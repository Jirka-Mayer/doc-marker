import { createContext } from "react";

export interface GroupLayoutContextState {
  /**
   * How deeply is the current group nested,
   * starts at 1 and increases
   */
  readonly depth: number;
}

export const GroupLayoutContext = createContext<GroupLayoutContextState>({
  depth: 1,
});
