/**
 * Performs value assignment on JSON data, but does not assign values
 * that haven't changed. This is done to keep reference equality
 * and save react re-renders when setting global state.
 * @param {any} variable What should we assign to
 * @param {any} value What should we assign there
 * @returns The new value of the variable
 */
export function assignIfNeeded<T>(variable: T, value: T): T {
  // when we are not changing the value
  if (variable === value) return variable;

  // when assigning array to array, we can keep inner values
  if (Array.isArray(variable) && Array.isArray(value)) {
    return assignArrayToArray(variable, value) as T;
  }

  // when assigning object to object, we can keep inner fields
  if (
    typeof variable === "object" &&
    variable !== null &&
    typeof value === "object" &&
    value !== null
  ) {
    return assignObjectToObject(variable, value) as T;
  }

  // default case is that we just set variable to value
  return value;
}

function assignObjectToObject(variable: object, value: object): object {
  const newVariable = {};
  let assignmentMade = false;

  // transfer value properties to the new value
  for (const key of Object.keys(value)) {
    newVariable[key] = assignIfNeeded(variable[key], value[key]);
    if (newVariable[key] !== variable[key]) {
      assignmentMade = true;
    }
  }

  // if there are any deleted properties, they get removed, which acts
  // as an assignment (i.e. we assign "undefined")
  for (const key of Object.keys(variable)) {
    if (!newVariable.hasOwnProperty(key)) {
      assignmentMade = true;
    }
  }

  if (assignmentMade) {
    return newVariable;
  } else {
    return variable;
  }
}

function assignArrayToArray<T>(variable: T[], value: T[]): T[] {
  const newVariable: T[] = [];
  let assignmentMade = false;

  // transfer value properties to the new value
  for (let i = 0; i < value.length; i++) {
    newVariable[i] = assignIfNeeded(variable[i], value[i]);
    if (newVariable[i] !== variable[i]) {
      assignmentMade = true;
    }
  }

  // if there are any deleted properties, they get removed, which acts
  // as an assignment (i.e. we assign "undefined")
  if (value.length < variable.length) {
    assignmentMade = true;
  }

  if (assignmentMade) {
    return newVariable;
  } else {
    return variable;
  }
}
