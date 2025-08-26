import { InputBase } from "@mui/material";
import { useDebouncedChange } from "../useDebounceChangeWithCancel";
import { useMemo } from "react";
import { CellProps } from "@jsonforms/core";
import { TranslateProps } from "@jsonforms/react";
import { DmInputProps } from "./DmInputProps";

const eventToValue = (e) =>
  e.target.value === "" ? undefined : e.target.value;

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
    () => t("text.placeholder", "Enter text...", { schema, uischema, path }),
    [t, schema, uischema, path],
  );

  return (
    <InputBase
      value={inputValue}
      onChange={onChangeInterceptor}
      onFocus={onFocus}
      id={htmlId}
      fullWidth={true}
      placeholder={placeholder}
    />
  );
}
