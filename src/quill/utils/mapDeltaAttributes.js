/**
 * Allows you to "map" attributes of a quill delta object
 * (map in the functional programming sense - modify key-value pairs in parallel)
 * 
 * The callback has signature:
 * (key, value) => { return [newKey, newValue]; }
 * 
 * @param {object} delta 
 * @param {CallableFunction} mapFunction 
 */
export function mapDeltaAttributes(delta, mapFunction) {
  return {
    ops: delta.ops.map(
      op => !op.attributes ? op : {
        ...op,
        attributes: mapAttributesObject(op.attributes, mapFunction)
      }
    )
  }
}

function mapAttributesObject(attributes, mapFunction) {
  const mappedAttributes = {}
  
  for (const key in attributes) {
    const [newKey, newValue] = mapFunction(key, attributes[key])
    mappedAttributes[newKey] = newValue
  }

  return mappedAttributes
}
