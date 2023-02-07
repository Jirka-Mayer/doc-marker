const INPUT_ID_PREFIX = "input6"

function scopeToPath(scope) {
  return scope
    .replaceAll("/properties/", ".")
    .replace("#.", "")
}

function queryData(data, path) {
  if (typeof data !== "object" || data === null)
    return undefined
  
  let i = path.indexOf(".")

  if (i === -1)
    return data[path]

  let pathSuffix = path.substr(i + 1)
  let pathPrefix = path.substr(0, i)
  let subData = data[pathPrefix]

  return queryData(subData, pathSuffix)
}

function exportHead() {
  return `{` // global starting brace
    + `sv={};` // set value (dictionary for setting fields to a value)
}

function exportTail() {
  return `for(var k in sv){`
    + `e=document.getElementById("${INPUT_ID_PREFIX}"+k);`
    + `e.value=sv[k];`
    + `e.onchange();`
    + `}`
    + `alert("Vložení dat se podařilo.");`
    + `}` // global ending brace
}

function buildSetValueSnippet(controlSchema, value) {
  // we need to know where to export to
  if (!controlSchema.onlineFormId)
    console.error(`Missing onlineFormId for ${controlSchema.scope}`)

  // de-prefix the ID
  let id = controlSchema.onlineFormId
  if (id.indexOf(INPUT_ID_PREFIX) !== 0)
    throw new Error("ID does not satisfy the prefix: " + id)
  let idDeprefixed = id.substr(INPUT_ID_PREFIX.length)

  // build the javscript snippet
  let encodedInputId = JSON.stringify(idDeprefixed)
  let encodedValue = JSON.stringify(value)
  return `sv[${encodedInputId}]=${encodedValue};`
}

function exportIntegerControl(controlSchema, value) {
  if (Number(value) !== value)
    throw new Error("Unexpected integer value: " + JSON.stringify(value))
  
  return buildSetValueSnippet(controlSchema, value + "")
}

function exportBooleanControl(controlSchema, value) {
  if (value !== true && value !== false)
    throw new Error("Unexpected boolean value")

  let number = value ? "1" : "2" // <select> input with two options
  return buildSetValueSnippet(controlSchema, number)
}

function exportEnumControl(controlSchema, value) {
  let number = value.split(" ")[0] // "1 (female)" -> "1"
  return buildSetValueSnippet(controlSchema, number)
}

function exportStringControl(controlSchema, value) {
  return buildSetValueSnippet(controlSchema, value)
}

function exportControl(controlSchema, globalDataSchema, value) {
  // controls with no value will not be exported
  if (value === undefined)
    return
  
  let schemaPath = controlSchema.scope.replaceAll("/", ".").substr(2)
  let dataSchema = queryData(globalDataSchema, schemaPath)
  const type = dataSchema.type

  // INTEGER
  if (type === "integer") {
    return exportIntegerControl(controlSchema, value)
  }

  // BOOLEAN
  else if (type === "boolean") {
    return exportBooleanControl(controlSchema, value)
  }

  // ENUM
  else if (type === "string" && dataSchema.enum) {
    return exportEnumControl(controlSchema, value)
  }

  // TIME
  else if (type === "string" && dataSchema.format === "time") {
    console.error("Time format export is not implemented yet")
    return
  }

  // TEXT (STRING)
  else if (type === "string") {
    return exportStringControl(controlSchema, value)
  }

  console.error("Don't know how to export control " + controlSchema.scope)
}

export function buildJavascriptCode(data, uiSchema, dataSchema) {
  let exportParts = []

  exportParts.push(exportHead())

  const visitControl = (controlSchema) => {
    const scope = controlSchema.scope
    const path = scopeToPath(scope)
    const value = queryData(data, path)
    exportParts.push(exportControl(controlSchema, dataSchema, value))
  }

  const traverseSchema = (schemaItem) => {
    const containers = ["Group", "VerticalLayout", "HorizontalLayout"]
    if (containers.indexOf(schemaItem.type) !== -1) {
      schemaItem.elements.forEach(traverseSchema)
    }
    else if (schemaItem.type === "Control") {
      visitControl(schemaItem)
    }
  }
  traverseSchema(uiSchema)

  exportParts.push(exportTail())

  return exportParts.join("")
}