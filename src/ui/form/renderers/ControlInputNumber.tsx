import { InputBase } from "@mui/material";
import { useDebouncedChange } from "../useDebounceChangeWithCancel";
import { useMemo } from "react";
import { CellProps } from "@jsonforms/core";
import { DmInputProps } from "./DmInputProps";
import { TranslateProps } from "@jsonforms/react";
import { InputCoercionFunction } from "./InputCoercionFunction";

const toNumber = (value) => (value === "" ? undefined : parseFloat(value));
const eventToValue = (e) => toNumber(e.target.value);

export const numberCoercionFunction: InputCoercionFunction = (givenValue) => {
  const n = toNumber(String(givenValue));
  if (n === undefined) return undefined;
  if (isNaN(n)) return 0;
  return n;
};

export function ControlInputNumber(
  props: CellProps & TranslateProps & DmInputProps,
) {
  const {
    // json forms
    data,
    path,
    handleChange,
    schema,
    uischema,
    t,

    // DocMarker
    htmlId,
    onFocus,
  } = props;

  const [inputValue, onChange] = useDebouncedChange(
    handleChange,
    "",
    data,
    path,
    eventToValue,
  );

  const placeholder = useMemo(
    () =>
      t("number.placeholder", "Enter a number...", { schema, uischema, path }),
    [t, schema, uischema, path],
  );

  return (
    <InputBase
      slotProps={{
        input: {
          className: "noscroll", // see usePreventScrollOverNumberFields
        },
      }}
      type="number"
      value={inputValue}
      onChange={onChange}
      onFocus={onFocus}
      id={htmlId}
      fullWidth={true}
      inputProps={{ step: "0.1" }}
      placeholder={placeholder}
    />
  );
}
