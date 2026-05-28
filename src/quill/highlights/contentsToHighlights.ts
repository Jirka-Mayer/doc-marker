import { TextRange } from "../../utils/TextRange";
import { Highlights } from "../Highlights";
import {
  QAttributes,
  QDelta,
  QOperation,
  isInsert,
  isInsertEmbed,
} from "../QDelta";

const HIGHLIGHT_ATTRIBUTE_PREFIX = "highlighted@";

/**
 * Converts Quill contents delta to the highlights format
 * (list of ranges for each highlight)
 */
export function contentsToHighlights(delta: QDelta): Highlights {
  const highlights: Highlights = {};
  const lonelyNewlineIndices = new Set<number>();

  // extract raw ranges
  let index = 0; // position in the text
  for (let deltaOpIndex = 0; deltaOpIndex < delta.ops.length; deltaOpIndex++) {
    const op: QOperation = delta.ops[deltaOpIndex];

    if (isInsert(op)) {
      if (op.attributes) {
        extractRanges(index, op.insert.length, op.attributes, highlights);
      }

      if (op.insert === "\n") {
        lonelyNewlineIndices.add(index);
      }

      index += op.insert.length;
    } else if (isInsertEmbed(op)) {
      index += 1; // embed takes up one character
    } else {
      throw new Error("Unexpected delta operation: " + JSON.stringify(op));
    }
  }

  // merge neighboring ranges
  for (let fieldId in highlights) {
    let ranges = highlights[fieldId];
    for (let i = 0; i < ranges.length - 1; i++) {
      let { index: aPos, length: aLen } = ranges[i];
      let { index: bPos, length: bLen } = ranges[i + 1];

      // merge if directly next to each other
      if (aPos + aLen === bPos) {
        mergeRanges(ranges, i);
        i -= 1;
        continue; // merge & continue
      }

      // merge if there is a lonely newline in between
      if (aPos + aLen + 1 === bPos && lonelyNewlineIndices.has(bPos - 1)) {
        mergeRanges(ranges, i);
        i -= 1;
        continue; // merge & continue
      }
    }
  }

  return highlights;
}

function range(index: number, length: number): TextRange {
  return { index, length };
}

function extractRanges(
  position: number,
  length: number,
  attributes: QAttributes,
  highlights: Highlights,
): void {
  for (let attribute in attributes) {
    if (attribute.indexOf(HIGHLIGHT_ATTRIBUTE_PREFIX) !== 0) continue;

    let fieldId = attribute.substring(HIGHLIGHT_ATTRIBUTE_PREFIX.length);

    if (attributes[attribute] !== true) {
      throw new Error("Unexpected attribute value: " + attributes[attribute]);
    }

    if (highlights[fieldId] === undefined) highlights[fieldId] = [];

    highlights[fieldId].push(range(position, length));
  }
}

function mergeRanges(ranges: TextRange[], index: number) {
  let { index: aPos, length: aLen } = ranges[index];
  let { index: bPos, length: bLen } = ranges[index + 1];
  let bEnd = bPos + bLen;

  // from aStart to bEnd
  ranges[index] = range(aPos, bEnd - aPos);
  ranges.splice(index + 1, 1);
}
