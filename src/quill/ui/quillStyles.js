import * as styles from "./quillStyles.module.scss"

// anonymization numbers (as strings) that are defined in the stylesheet
const allAnonymizationNumbers = Object.keys(styles)
  .filter(k => k.indexOf("anonymization-") === 0)
  .map(k => {
    const from = "anonymization-".length
    const to = k.length - "-yes".length
    return k.substring(from, to)
  })
  .sort()

// highlight numbers (as strings) that are defined in the stylesheet
const allHighlightNumbers = Object.keys(styles)
  .filter(k => k.indexOf("highlight-") === 0)
  .map(k => {
    const from = "highlight-".length
    const to = k.length - "-yes".length
    return k.substring(from, to)
  })
  .sort()

// set of all CSS classes that signal highlight activity on the quill element
const activateHighlightValueClassSet = new Set(
  Object.keys(styles)
    .filter(k => k.indexOf("activate-highlight-") === 0)
    .map(k => styles[k])
)

export {
  styles,
  allAnonymizationNumbers,
  allHighlightNumbers,
  activateHighlightValueClassSet
}
