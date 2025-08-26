import * as React from "react";
import {
  ControlProps,
  isStringControl,
  RankedTester,
  rankWith,
} from "@jsonforms/core";
import {
  TranslateProps,
  withJsonFormsControlProps,
  withTranslateProps,
} from "@jsonforms/react";
import { DmInputControl } from "./DmInputControl";
import { ControlInputText } from "./ControlInputText";

export function DmTextControl(props: ControlProps & TranslateProps) {
  return <DmInputControl {...props} input={ControlInputText} />;
}

export const dmTextControlTester: RankedTester = rankWith(1, isStringControl);

export default withJsonFormsControlProps(
  withTranslateProps(
    // passes in the "t" prop
    React.memo(DmTextControl),
  ),
);
