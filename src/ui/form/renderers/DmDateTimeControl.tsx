import * as React from "react";
import {
  or,
  isDateControl,
  isTimeControl,
  isDateTimeControl,
  rankWith,
  ControlProps,
  RankedTester,
} from "@jsonforms/core";
import {
  TranslateProps,
  withJsonFormsControlProps,
  withTranslateProps,
} from "@jsonforms/react";
import { DmInputControl } from "./DmInputControl";
import { ControlInputDateTime } from "./ControlInputDateTime";

export function DmDateTimeControl(props: ControlProps & TranslateProps) {
  return <DmInputControl {...props} input={ControlInputDateTime} />;
}

export const dmDateTimeControlTester: RankedTester = rankWith(
  2,
  or(isDateControl, isTimeControl, isDateTimeControl),
);

export default withJsonFormsControlProps(
  // passes in the "options" prop
  withTranslateProps(
    // passes in the "t" prop
    React.memo(DmDateTimeControl),
  ),
);
