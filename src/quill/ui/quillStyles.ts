import * as styles from "./quillStyles.module.scss";

export { styles };

/**
 * Anonymization kind IDs that are defined in the stylesheet,
 * e.g. "name-organization", "personalInformation"
 */
export const allAnonymizationKindIds: string[] = Object.keys(styles)
  .filter((k) => k.indexOf("anonymization--") === 0)
  .map((k) => {
    const from = "anonymization--".length;
    return k.substring(from);
  })
  .sort();

/**
 * Highlight numbers (as integers) that are defined in the stylesheet
 */
export const allHighlightNumbers: number[] = Object.keys(styles)
  .filter((k) => k.indexOf("highlight-") === 0)
  .map((k) => {
    const from = "highlight-".length;
    const to = k.length - "-yes".length;
    const stringNumber = k.substring(from, to);
    const number = parseInt(stringNumber);
    if (isNaN(number)) {
      throw new Error(`Cannot resolve number from highlight: ${k}`);
    }
    return number;
  })
  .sort();

/**
 * Set of all CSS classes that signal a highlight being active
 * on the quill element. Used by the rendering logic to erase
 * these classes when the active form field changes to another one.
 */
export const activateHighlightValueClassSet = new Set(
  Object.keys(styles)
    .filter((k) => k.indexOf("activate-highlight-") === 0)
    .map((k) => styles[k]),
);
