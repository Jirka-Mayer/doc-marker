/**
 * Function that takes any input (usually robot generated)
 * and coerces it into a valid value for a given form field.
 * Valid value is a value that the human user could have entered
 * via the user interface. It is used to prevent insertion of invalid
 * values into the form when using the automatic form filling.
 */
export type InputCoercionFunction = (givenValue: any) => any;
