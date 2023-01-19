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

import ResqEnumControl, {
  resqEnumControlTester,
  ResqEnumControl as ResqEnumControlUnwrapped
} from "./ResqEnumControl"


// ========== Export ==========

export const Unwrapped = {
  ResqTextControl: ResqTextControlUnwrapped,
  ResqIntegerControl: ResqIntegerControlUnwrapped
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
  ResqEnumControl,
  resqEnumControlTester
}
