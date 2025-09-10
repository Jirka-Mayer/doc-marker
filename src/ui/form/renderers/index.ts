/*
  Take inspiration here:
  https://github.com/eclipsesource/jsonforms/blob/master/packages/material-renderers/src/controls/index.ts
*/

// ========== Layouts ==========

import { DmLinearLayout, dmLinearLayoutTester } from "./DmLinearLayout";
import { DmGroupLayout, dmGroupLayoutTester } from "./DmGroupLayout";

// ========== Controls ==========

import {
  dmTextControlTester,
  DmTextControlUnwrapped,
  DmTextControl,
} from "./DmTextControl";

import {
  dmIntegerControlTester,
  DmIntegerControlUnwrapped,
  DmIntegerControl,
} from "./DmIntegerControl";

import {
  dmNumberControlTester,
  DmNumberControlUnwrapped,
  DmNumberControl,
} from "./DmNumberControl";

import {
  dmBooleanControlTester,
  DmBooleanControlUnwrapped,
  DmBooleanControl,
} from "./DmBooleanControl";

import {
  dmEnumControlTester,
  DmEnumControlUnwrapped,
  DmEnumControl,
} from "./DmEnumControl";

import {
  dmDateTimeControlTester,
  DmDateTimeControlUnwrapped,
  DmDateTimeControl,
} from "./DmDateTimeControl";

// ========== Export ==========

export const Unwrapped = {
  DmTextControl: DmTextControlUnwrapped,
  DmIntegerControl: DmIntegerControlUnwrapped,
  DmNumberControl: DmNumberControlUnwrapped,
  DmBooleanControl: DmBooleanControlUnwrapped,
  DmEnumControl: DmEnumControlUnwrapped,
  DmDateTimeControl: DmDateTimeControlUnwrapped,
};

export {
  // layouts
  DmLinearLayout,
  dmLinearLayoutTester,
  DmGroupLayout,
  dmGroupLayoutTester,

  // controls
  DmTextControl,
  dmTextControlTester,
  DmIntegerControl,
  dmIntegerControlTester,
  DmNumberControl,
  dmNumberControlTester,
  DmBooleanControl,
  dmBooleanControlTester,
  DmEnumControl,
  dmEnumControlTester,
  DmDateTimeControl,
  dmDateTimeControlTester,
};
