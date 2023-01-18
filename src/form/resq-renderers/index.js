/*
  Take inspiration here:
  https://github.com/eclipsesource/jsonforms/blob/master/packages/material-renderers/src/controls/index.ts
*/

import ResqTextControl, {
  resqTextControlTester,
  ResqTextControl as ResqTextControlUnwrapped
} from "./ResqTextControl"

import ResqIntegerControl, {
  resqIntegerControlTester,
  ResqIntegerControl as ResqIntegerControlUnwrapped
} from "./ResqIntegerControl"

export const Unwrapped = {
  ResqTextControl: ResqTextControlUnwrapped,
  ResqIntegerControl: ResqIntegerControlUnwrapped
}

export {
  ResqTextControl,
  resqTextControlTester,
  ResqIntegerControl,
  resqIntegerControlTester
}
