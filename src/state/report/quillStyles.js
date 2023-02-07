import * as styles from "./quillStyles.module.scss"

// set of all ".active-{num}" css classes
const activeCssClassSet = new Set(
  Object.values(styles).filter(k => k.indexOf("active") !== -1)
)

// field numbers (as strings) that are defined in the stylesheet
const allFieldNumbers = Object.keys(styles)
  .filter(k => k.indexOf("active-") === 0)
  .map(k => k.substring("active-".length))
  .sort()

export { styles, activeCssClassSet, allFieldNumbers }
