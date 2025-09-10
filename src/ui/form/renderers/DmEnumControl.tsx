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
import {
  ControlInputSelect,
  selectCoercionPseudofunction,
} from "./ControlInputSelect";
import { InputCoercionFunction } from "./InputCoercionFunction";

export function DmEnumControlUnwrapped(
  props: ControlProps & OwnPropsOfEnum & TranslateProps,
) {
  const optionValues: any[] = React.useMemo(
    () => props.options?.map((o) => o.value)?.sort() || [],
    [props.options],
  );

  const coercionFunction: InputCoercionFunction = React.useCallback(
    (givenValue: any) => {
      return selectCoercionPseudofunction(givenValue, optionValues);
    },
    [optionValues],
  );

  return (
    <DmInputControl
      {...props}
      ignoreNullability={true}
      input={ControlInputSelect}
      inputCoercionFunction={coercionFunction}
    />
  );
}

export const dmEnumControlTester: RankedTester = rankWith(2, isEnumControl);

// passes in the "options" prop
export const DmEnumControl = withJsonFormsEnumProps(
  // passes in the "t" prop
  withTranslateProps(React.memo(DmEnumControlUnwrapped)),
);
