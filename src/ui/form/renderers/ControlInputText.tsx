import { InputBase } from "@mui/material";
import { useDebouncedChange } from "../useDebounceChangeWithCancel";
import { useMemo } from "react";
import { CellProps } from "@jsonforms/core";
import { TranslateProps } from "@jsonforms/react";
import { DmInputProps } from "./DmInputProps";
import { InputCoercionFunction } from "./InputCoercionFunction";

const eventToValue = (e) =>
  e.target.value === "" ? undefined : e.target.value;

export const textCoercionFunction: InputCoercionFunction = (givenValue) => {
  return String(givenValue);
};

export function ControlInputText(
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
    () => t("text.placeholder", "Enter text...", { schema, uischema, path }),
    [t, schema, uischema, path],
  );

  return (
    <InputBase
      value={inputValue}
      onChange={onChange}
      onFocus={onFocus}
      id={htmlId}
      fullWidth={true}
      placeholder={placeholder}
    />
  );
}
