import * as React from "react";
import {
  ControlProps,
  isNumberControl,
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
  ControlInputNumber,
  numberCoercionFunction,
} from "./ControlInputNumber";

export function DmNumberControl(props: ControlProps & TranslateProps) {
  return (
    <DmInputControl
      {...props}
      input={ControlInputNumber}
      inputCoercionFunction={numberCoercionFunction}
    />
  );
}

export const dmNumberControlTester: RankedTester = rankWith(2, isNumberControl);

export default withJsonFormsControlProps(
  withTranslateProps(
    // passes in the "t" prop
    React.memo(DmNumberControl),
  ),
);
