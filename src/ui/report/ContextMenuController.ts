import { atom } from "jotai";
import { TextRange } from "../../utils/TextRange";
import { PopoverPosition } from "@mui/material";
import { QuillExtended } from "../../quill/QuillExtended";
import { JotaiStore } from "../../state/JotaiStore";

/**
 * A controller for a single context menu that opens
 * after clicking/dragging in the report text.
 */
export class ContextMenuController {
  private readonly jotaiStore: JotaiStore;
  private readonly quillExtended: QuillExtended;

  constructor(jotaiStore: JotaiStore, quillExtended: QuillExtended) {
    this.jotaiStore = jotaiStore;
    this.quillExtended = quillExtended;
  }

  /**
   * The quill text range that the context menu belongs to
   * (null when menu closed)
   */
  public readonly anchorTextRangeAtom = atom<TextRange | null>(null);

  /**
   * The anchor position object from MUI
   * (null when menu closed)
   */
  public readonly anchorPositionAtom = atom<PopoverPosition | null>(null);

  /**
   * Closes the context menu if it's open
   */
  public closeMenu(): void {
    // clear selection silently (to not trigger the click event)
    const range = this.jotaiStore.get(this.anchorTextRangeAtom);
    if (range !== null) {
      this.quillExtended.setSelection(range.index, 0, "silent");
    }

    // close the menu
    this.jotaiStore.set(this.anchorTextRangeAtom, null);
    this.jotaiStore.set(this.anchorPositionAtom, null);
  }

  /**
   * Opens the context menu next to the specified text range
   */
  public openMenu(textRange: TextRange): void {
    // calculate screen positioning
    const bounds = this.quillExtended.getBoundsInPage(
      textRange.index,
      textRange.length,
    );

    // write atoms
    this.jotaiStore.set(this.anchorTextRangeAtom, textRange);
    this.jotaiStore.set(this.anchorPositionAtom, {
      top: bounds.top + bounds.height + 5,
      left: bounds.left,
    });
  }
}
