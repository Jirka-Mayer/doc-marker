import { uiTypeIs, schemaTypeIs, isControl } from '@jsonforms/core'

// See for inspiration:
// https://github.com/eclipsesource/jsonforms/blob/master/packages/core/src/testers/testers.ts

/**
 * UI Schema tester for JSON forms,
 * matches the multiselect group
 * @param {any} uischema 
 */
export const isMultiselectGroup = (uischema, schema, context) => {
  if (!uiTypeIs("Group")(uischema))
    return false
  
  if (!Array.isArray(uischema.elements))
    return false

  if (uischema.elements.length !== 2)
    return false

  // multiselect leader control
  const leader = uischema.elements[0]

  if (!isControl(leader))
    return false

  if (!schemaTypeIs("boolean")(leader, schema, context))
    return false

  if (!leader.options || typeof leader.options !== "object")
    return false
  
  return leader.options.multiselect === true
}