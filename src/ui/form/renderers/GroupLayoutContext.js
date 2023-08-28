import { createContext } from 'react'

export const GroupLayoutContext = createContext({
  /**
   * How deeply is the current group nested
   */
  depth: 1
})
