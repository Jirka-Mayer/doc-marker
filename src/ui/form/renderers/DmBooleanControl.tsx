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
import { ControlInputBoolean } from "./ControlInputBoolean";

export function DmBooleanControl(props: ControlProps & TranslateProps) {
  return (
    <DmInputControl
      {...props}
      ignoreNullability={true}
      input={ControlInputBoolean}
    />
  );
}

export const dmBooleanControlTester: RankedTester = rankWith(
  2,
  isBooleanControl,
);

export default withJsonFormsControlProps(
  withTranslateProps(
    // passes in the "t" prop
    React.memo(DmBooleanControl),
  ),
);
