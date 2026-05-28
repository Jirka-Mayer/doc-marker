import Quill from "quill";
import { QRange } from "./QRange";
import { QSource } from "./QSource";

/**
 * Modifies the behaviour of quill selection so that the user can only
 * select entire words
 */
export class WordSelector {
  /**
   * The internal quill instance
   */
  private readonly quill: Quill;

  /**
   * Is the word-selection currently enabled or not?
   * Set from the outside to enable/disable this functionality.
   */
  public isEnabled: boolean = false;

  constructor(quill: Quill) {
    this.quill = quill;
  }

  /**
   * Called by the QuillWrapper to possibly intercept selection change events.
   * If we return true, the event is intercepted and does not propagate to
   * the outside. Otherwise the event is untouched.
   */
  public interceptSelectionChangeEvent(
    range: QRange,
    oldRange: QRange,
    source: QSource,
  ): boolean {
    // do not intercept if we are not enabled
    if (!this.isEnabled) {
      return false;
    }

    // cursor is not in the editor
    if (!range) {
      return false;
    }

    // do not intercept selection click
    if (range.length === 0) {
      return false;
    }

    // if the range ends on space, make the range one char shorter
    // (doubleclick on some systems selects a word with its trailing space)
    if (
      range.length > 1 &&
      this.quill.getText(range.index + range.length - 1, 1) === " "
    ) {
      range.length -= 1;
    }

    // intercepting selection drag
    const grownRange = this.growRangeToContainWords(range);
    if (
      grownRange.index === range.index &&
      grownRange.length === range.length
    ) {
      // the range did not grow anymore, so no intercepting needed
      return false;
    } else {
      // the range did grow, so we do a re-select and kill this event
      this.quill.setSelection(grownRange.index, grownRange.length, source);
      return true;
    }
  }

  /**
   * Grows the given range until it contains entire words
   */
  private growRangeToContainWords(range: QRange): QRange {
    let from = this.getWordStartBefore(range.index);
    let to = this.getWordEndAfter(range.index + range.length);
    return {
      index: from,
      length: to - from,
    };
  }

  private getWordStartBefore(index: number): number {
    const WINDOW = 50;
    const text: string = this.quill.getText(index - WINDOW, WINDOW);
    for (let i = text.length - 1; i >= 0; i--) {
      if (!this.isWordChar(text[i])) {
        return index - text.length + i + 1;
      }
    }
    return index - text.length;
  }

  private getWordEndAfter(index: number): number {
    const WINDOW = 50;
    const text: string = this.quill.getText(index, WINDOW);
    for (let i = 0; i < text.length; i++) {
      if (!this.isWordChar(text[i])) {
        return index + i;
      }
    }
    return index + text.length - 1;
  }

  private isWordChar(char: string): boolean {
    if (char == " " || char == "\n" || char == "\t" || char == "\r") {
      return false;
    }
    return true;
  }
}
