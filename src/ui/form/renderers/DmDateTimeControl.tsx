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
import {
  ControlInputDateTime,
  dateTimeCoercionPseudofunction,
  PickerVariant,
} from "./ControlInputDateTime";
import { InputCoercionFunction } from "./InputCoercionFunction";

export function DmDateTimeControlUnwrapped(
  props: ControlProps & TranslateProps,
) {
  // "date", "time", "date-time"
  const pickerVariant: PickerVariant =
    (props.schema.format as PickerVariant) || "date-time";

  const coercionFunction: InputCoercionFunction = React.useCallback(
    (givenValue: any) => {
      return dateTimeCoercionPseudofunction(givenValue, pickerVariant);
    },
    [pickerVariant],
  );

  return (
    <DmInputControl
      {...props}
      input={ControlInputDateTime}
      inputCoercionFunction={coercionFunction}
    />
  );
}

export const dmDateTimeControlTester: RankedTester = rankWith(
  2,
  or(isDateControl, isTimeControl, isDateTimeControl),
);

export const DmDateTimeControl = withJsonFormsControlProps(
  // passes in the "options" prop
  withTranslateProps(
    // passes in the "t" prop
    React.memo(DmDateTimeControlUnwrapped),
  ),
);
