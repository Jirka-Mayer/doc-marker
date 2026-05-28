import Delta from "quill-delta";

const CELL_SEPARATOR = "\t|\t";

function traverseTable(element: HTMLElement): Delta {
  let delta = new Delta();
  let firstCellOfRow = true;

  for (let child of element.children) {
    // skip non-html elements
    if (!(child instanceof HTMLElement)) {
      continue;
    }

    const tag = child.tagName.toLowerCase();

    if (tag === "caption") {
      delta = delta.insert(child.innerText + "\n");
    }
    if (tag === "thead") {
      delta = delta.concat(traverseTable(child));
    }
    if (tag === "tbody") {
      delta = delta.concat(traverseTable(child));
    }
    if (tag === "tr") {
      delta = delta.concat(traverseTable(child)).insert("\n");
    }
    if (tag === "th" || tag == "td") {
      // tab before
      if (!firstCellOfRow) {
        delta = delta.insert(CELL_SEPARATOR);
      }
      firstCellOfRow = false;

      // cell contents
      delta = delta.insert(child.innerText, { bold: tag === "th" });
    }
  }

  return delta;
}

export function htmlTableToDelta(table: HTMLElement): Delta {
  return traverseTable(table).insert("\n");
}
