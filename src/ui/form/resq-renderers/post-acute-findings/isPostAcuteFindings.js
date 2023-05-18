import { uiTypeIs, schemaTypeIs, isControl } from '@jsonforms/core'

/**
 * UI Schema tester for JSON forms,
 * "group.post_acute.findings" group
 * @param {any} uischema 
 */
export const isPostAcuteFindings = (uischema, schema, context) => {
  if (!uiTypeIs("Group")(uischema))
    return false

  return uischema["label"] === "group.post_acute.findings"
}