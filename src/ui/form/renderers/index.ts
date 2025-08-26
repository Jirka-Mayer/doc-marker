/*
  Take inspiration here:
  https://github.com/eclipsesource/jsonforms/blob/master/packages/material-renderers/src/controls/index.ts
*/

// ========== Layouts ==========

import DmLinearLayout, { dmLinearLayoutTester } from "./DmLinearLayout";

import DmGroupLayout, { dmGroupTester } from "./DmGroupLayout";

// ========== Controls ==========

import DmTextControl, {
  dmTextControlTester,
  DmTextControl as DmTextControlUnwrapped,
} from "./DmTextControl";

import DmIntegerControl, {
  dmIntegerControlTester,
  DmIntegerControl as DmIntegerControlUnwrapped,
} from "./DmIntegerControl";

import DmNumberControl, {
  dmNumberControlTester,
  DmNumberControl as DmNumberControlUnwrapped,
} from "./DmNumberControl";

import DmBooleanControl, {
  dmBooleanControlTester,
  DmBooleanControl as DmBooleanControlUnwrapped,
} from "./DmBooleanControl";

import DmEnumControl, {
  dmEnumControlTester,
  DmEnumControl as DmEnumControlUnwrapped,
} from "./DmEnumControl";

import DmDateTimeControl, {
  dmDateTimeControlTester,
  DmDateTimeControl as DmDateTimeControlUnwrapped,
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
  dmGroupTester,

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
