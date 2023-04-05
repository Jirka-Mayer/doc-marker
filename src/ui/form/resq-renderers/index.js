/*
  Take inspiration here:
  https://github.com/eclipsesource/jsonforms/blob/master/packages/material-renderers/src/controls/index.ts
*/


// ========== Layouts ==========

import ResqVerticalLayout, {
  resqVerticalLayoutTester
} from "./ResqVerticalLayout"

import ResqGroupLayout, {
  resqGroupTester
} from "./ResqGroupLayout"


// ========== Controls ==========

import ResqTextControl, {
  resqTextControlTester,
  ResqTextControl as ResqTextControlUnwrapped
} from "./ResqTextControl"

import ResqIntegerControl, {
  resqIntegerControlTester,
  ResqIntegerControl as ResqIntegerControlUnwrapped
} from "./ResqIntegerControl"

import ResqNumberControl, {
  resqNumberControlTester,
  ResqNumberControl as ResqNumberControlUnwrapped
} from "./ResqNumberControl"

import ResqBooleanControl, {
  resqBooleanControlTester,
  ResqBooleanControl as ResqBooleanControlUnwrapped
} from "./ResqBooleanControl"

import ResqEnumControl, {
  resqEnumControlTester,
  ResqEnumControl as ResqEnumControlUnwrapped
} from "./ResqEnumControl"

import ResqDateTimeControl, {
  resqDateTimeControlTester,
  ResqDateTimeControl as ResqDateTimeControlUnwrapped
} from "./ResqDateTimeControl"

import ResqMultiselectGroup, {
  resqMultiselectGroupTester,
  ResqMultiselectGroup as ResqMultiselectGroupUnwrapped
} from "./multiselect/ResqMultiselectGroup"


// ========== Export ==========

export const Unwrapped = {
  ResqTextControl: ResqTextControlUnwrapped,
  ResqIntegerControl: ResqIntegerControlUnwrapped,
  ResqNumberControl: ResqNumberControlUnwrapped,
  ResqBooleanControl: ResqBooleanControlUnwrapped,
  ResqEnumControl: ResqEnumControlUnwrapped,
  ResqDateTimeControl: ResqDateTimeControlUnwrapped,
  ResqMultiselectGroup: ResqMultiselectGroupUnwrapped
}

export {
  // layouts
  ResqVerticalLayout,
  resqVerticalLayoutTester,
  ResqGroupLayout,
  resqGroupTester,

  // controls
  ResqTextControl,
  resqTextControlTester,
  ResqIntegerControl,
  resqIntegerControlTester,
  ResqNumberControl,
  resqNumberControlTester,
  ResqBooleanControl,
  resqBooleanControlTester,
  ResqEnumControl,
  resqEnumControlTester,
  ResqDateTimeControl,
  resqDateTimeControlTester,
  ResqMultiselectGroup,
  resqMultiselectGroupTester
}
