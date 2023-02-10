/**
 * Returns a range, where the format at the given position with the given value
 * starts and ends. Returns null if there is not such format at the position.
 * Only inline-formats are supported, block-formats are ignored.
 * @param {any} quill The quill instance
 * @param {number} index The position to inspect.
 * @param {string} formatName
 * @param {any} formatValue
 */
export function getInlineFormatRange(quill, index, formatName, formatValue) {
  const from = followFormatLeft(quill, index, formatName, formatValue)
  const to = followFormatRight(quill, index, formatName, formatValue)
  
  // check the format has size 0
  if (from === to)
    return null

  // return a range
  return {
    index: from,
    length: to - from
  }
}

function followFormatLeft(quill, startIndex, formatName, formatValue) {
  let index = startIndex - 1
  while (true) {
    if (quill.getText(index, 1) != "\n") {
      const format = quill.getFormat(index, 1)
      if (format[formatName] !== formatValue)
        break
    }      
    index -= 1
  }
  return index + 1
}

function followFormatRight(quill, startIndex, formatName, formatValue) {
  let index = startIndex
  while (true) {
    if (quill.getText(index, 1) != "\n") {
      let format = quill.getFormat(index, 1)
      if (format[formatName] !== formatValue)
        break
    }
    index += 1
  }
  return index
}
