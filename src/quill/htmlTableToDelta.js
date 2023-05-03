import Delta from "quill-delta"

const CELL_SEPARATOR = "\t|\t"

/**
 * @param {HTMLElement} element
 * @returns {Delta}
 */
function traverseTable(element) {
  let delta = new Delta()
  let firstCellOfRow = true
  
  for (let child of element.children) {
    const tag = child.tagName.toLowerCase()
    
    if (tag === "caption") {
      delta = delta.insert(child.innerText + "\n")
    }
    if (tag === "thead") {
      delta = delta.concat(traverseTable(child))
    }
    if (tag === "tbody") {
      delta = delta.concat(traverseTable(child))
    }
    if (tag === "tr") {
      delta = delta.concat(traverseTable(child)).insert("\n")
    }
    if (tag === "th" || tag == "td") {
      // tab before
      if (!firstCellOfRow) {
        delta = delta.insert(CELL_SEPARATOR)
      }
      firstCellOfRow = false

      // cell contents
      delta = delta.insert(
        child.innerText,
        { bold: tag === "th" }
      )
    }
  }

  return delta
}

/**
 * @param {HTMLElement} table 
 * @returns {Delta}
 */
export function htmlTableToDelta(table) {
  return traverseTable(table).insert("\n")
}