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
import { ControlInputText, textCoercionFunction } from "./ControlInputText";

export function DmTextControlUnwrapped(props: ControlProps & TranslateProps) {
  return (
    <DmInputControl
      {...props}
      input={ControlInputText}
      inputCoercionFunction={textCoercionFunction}
    />
  );
}

export const dmTextControlTester: RankedTester = rankWith(1, isStringControl);

export const DmTextControl = withJsonFormsControlProps(
  withTranslateProps(
    // passes in the "t" prop
    React.memo(DmTextControlUnwrapped),
  ),
);
