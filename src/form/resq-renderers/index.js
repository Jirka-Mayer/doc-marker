/*
  Take inspiration here:
  https://github.com/eclipsesource/jsonforms/blob/master/packages/material-renderers/src/controls/index.ts
*/

import ResqTextControl, {
  resqTextControlTester,
  ResqTextControl as ResqTextControlUnwrapped
} from "./ResqTextControl"

export const Unwrapped = {
  ResqTextControl: ResqTextControlUnwrapped
}

export {
  ResqTextControl,
  resqTextControlTester
}
