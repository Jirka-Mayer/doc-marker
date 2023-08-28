/**
 * Returns the empty object hierarchy for form data
 * based on the given data json schema
 */
export function extractFormDataHierarchy(dataSchema) {
  const paths = []
  traverse(dataSchema, paths, [])

  const hierarchy = {}
  for (let path of paths) {
    let pointer = hierarchy
    for (let segment of path) {
      if (!pointer[segment])
        pointer[segment] = {}
      pointer = pointer[segment]
    }
  }

  return hierarchy
}

function traverse(schema, paths, path) {
  // skip non-object schemas
  if (schema.type !== "object")
    return
  
  paths.push(path)
  
  for (let key in schema.properties) {
    traverse(schema.properties[key], paths, [...path, key])
  }
}
