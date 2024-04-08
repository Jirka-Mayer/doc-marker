import { atom } from "jotai";
import { reportStore } from "../../../state";
const quillExtended = reportStore.quillExtended

/**
 * Constructs atoms used by text-selection-based context menus
 */
export function createContextMenuAtoms() {
  
  /**
   * The quill text range that the context menu belongs to
   * (null if menu closed)
   */
  const anchorTextRangeAtom = atom(null)
  
  /**
   * The anchor position object
   * (null if menu closed)
   */
  const anchorPositionAtom = atom(null)

  /**
   * Closes the menu
   */
  const closeMenuAtom = atom(null, (get, set) => {
    // clear selection silently (to not trigger the click event)
    const range = get(anchorTextRangeAtom)
    if (range !== null)
      quillExtended.setSelection(range.index, 0, "silent")
    
    // close the menu
    set(anchorTextRangeAtom, null)
    set(anchorPositionAtom, null)
  })

  /**
   * Opens the menu, requires quill text range argument
   */
  const openMenuAtom = atom(null, (get, set, quillRange) => {
    // calculate screen positioning
    const bounds = quillExtended.getBounds(quillRange.index, quillRange.length)
    const rect = quillExtended.quillElement.getBoundingClientRect()
    
    // write atoms
    set(anchorTextRangeAtom, quillRange)
    set(anchorPositionAtom, {
      top: rect.top + bounds.height + bounds.top + 5,
      left: rect.left + bounds.left
    })
  })

  return {
    anchorTextRangeAtom,
    anchorPositionAtom,
    closeMenuAtom,
    openMenuAtom
  }
}