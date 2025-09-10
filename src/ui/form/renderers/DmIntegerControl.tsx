import * as React from "react";
import {
  ControlProps,
  isIntegerControl,
  RankedTester,
  rankWith,
} from "@jsonforms/core";
import {
  TranslateProps,
  withJsonFormsControlProps,
  withTranslateProps,
} from "@jsonforms/react";
import { DmInputControl } from "./DmInputControl";
import { ControlInputInteger } from "./ControlInputInteger";
import { integerCoercionFunction } from "./ControlInputInteger";

export function DmIntegerControlUnwrapped(
  props: ControlProps & TranslateProps,
) {
  return (
    <DmInputControl
      {...props}
      input={ControlInputInteger}
      inputCoercionFunction={integerCoercionFunction}
    />
  );
}

export const dmIntegerControlTester: RankedTester = rankWith(
  2,
  isIntegerControl,
);

export const DmIntegerControl = withJsonFormsControlProps(
  withTranslateProps(
    // passes in the "t" prop
    React.memo(DmIntegerControlUnwrapped),
  ),
);
