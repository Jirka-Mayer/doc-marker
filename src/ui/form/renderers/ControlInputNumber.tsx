import { InputBase } from "@mui/material";
import { useDebouncedChange } from "../useDebounceChangeWithCancel";
import { useMemo } from "react";
import { CellProps } from "@jsonforms/core";
import { DmInputProps } from "./DmInputProps";
import { TranslateProps } from "@jsonforms/react";

const toNumber = (value) => (value === "" ? undefined : parseFloat(value));
const eventToValue = (e) => toNumber(e.target.value);

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
    observeChange,
  } = props;

  const [inputValue, onChange] = useDebouncedChange(
    handleChange,
    "",
    data,
    path,
    eventToValue,
  );

  function onChangeInterceptor(e) {
    observeChange(eventToValue(e));
    onChange(e);
  }

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
      onChange={onChangeInterceptor}
      onFocus={onFocus}
      id={htmlId}
      fullWidth={true}
      inputProps={{ step: "0.1" }}
      placeholder={placeholder}
    />
  );
}
