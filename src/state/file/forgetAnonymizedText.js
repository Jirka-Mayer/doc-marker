/**
 * Removes anonymized text from the serialized file
 */
export function forgetAnonymizedText(fileJson) {
  let delta = fileJson["_reportDelta"]
  let text = fileJson["_reportText"]

  let index = 0
  for (let op of delta.ops) {
    if (op?.attributes?.anonymized) {
      op.insert = forgetText(op.insert)
      text = forgetTextAt(text, index, op.insert.length)
    }

    index += op.insert.length
  }

  fileJson["_reportDelta"] = delta
  fileJson["_reportText"] = text
  return fileJson
}

function forgetTextAt(text, index, length) {
  const a = text.substr(0, index)
  const b = text.substr(index, length)
  const c = text.substr(index + length)
  return a + forgetText(b) + c
}

function forgetText(text) {
  return [...text].map(c => {
    if (c === " " || c === "\n" || c === "\r" || c === "\t")
      return c
    
    return "*"
  }).join("")
}