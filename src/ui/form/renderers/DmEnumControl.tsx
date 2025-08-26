import * as React from "react";
import {
  ControlProps,
  isEnumControl,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
} from "@jsonforms/core";
import {
  TranslateProps,
  withJsonFormsEnumProps,
  withTranslateProps,
} from "@jsonforms/react";
import { DmInputControl } from "./DmInputControl";
import { ControlInputSelect } from "./ControlInputSelect";

export function DmEnumControl(
  props: ControlProps & OwnPropsOfEnum & TranslateProps,
) {
  return (
    <DmInputControl
      {...props}
      ignoreNullability={true}
      input={ControlInputSelect}
    />
  );
}

export const dmEnumControlTester: RankedTester = rankWith(2, isEnumControl);

// passes in the "options" prop
export default withJsonFormsEnumProps(
  // passes in the "t" prop
  withTranslateProps(React.memo(DmEnumControl)),
);
