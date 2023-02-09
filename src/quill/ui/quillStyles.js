import * as styles from "./quillStyles.module.scss"

// anonymization numbers (as strings) that are defined in the stylesheet
const allAnonymizationNumbers = Object.keys(styles)
  .filter(k => k.indexOf("anonymization-") === 0)
  .map(k => {
    const from = "anonymization-".length
    const to = k.length - "-yes".length
    const len = to - from
    return k.substring(from, len)
  })
  .sort()

// highlight numbers (as strings) that are defined in the stylesheet
const allHighlightNumbers = Object.keys(styles)
  .filter(k => k.indexOf("highlight-") === 0)
  .map(k => {
    const from = "highlight-".length
    const to = k.length - "-yes".length
    const len = to - from
    return k.substring(from, len)
  })
  .sort()

// set of all CSS classes that signal highlight activity on the quill element
const activateHighlightClassSet = new Set(
  Object.values(styles)
    .filter(k => k.indexOf("activate-highlight-") === 0)
)

export {
  styles,
  allAnonymizationNumbers,
  allHighlightNumbers,
  activateHighlightClassSet
}
