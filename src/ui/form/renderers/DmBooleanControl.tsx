import * as React from "react";
import {
  ControlProps,
  isBooleanControl,
  RankedTester,
  rankWith,
} from "@jsonforms/core";
import {
  TranslateProps,
  withJsonFormsControlProps,
  withTranslateProps,
} from "@jsonforms/react";
import { DmInputControl } from "./DmInputControl";
import {
  booleanCoercionFunction,
  ControlInputBoolean,
} from "./ControlInputBoolean";

export function DmBooleanControlUnwrapped(
  props: ControlProps & TranslateProps,
) {
  return (
    <DmInputControl
      {...props}
      ignoreNullability={true}
      input={ControlInputBoolean}
      inputCoercionFunction={booleanCoercionFunction}
    />
  );
}

export const dmBooleanControlTester: RankedTester = rankWith(
  2,
  isBooleanControl,
);

export const DmBooleanControl = withJsonFormsControlProps(
  withTranslateProps(
    // passes in the "t" prop
    React.memo(DmBooleanControlUnwrapped),
  ),
);
