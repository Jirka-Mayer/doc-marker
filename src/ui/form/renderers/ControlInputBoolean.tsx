import { CellProps } from "@jsonforms/core";
import { TranslateProps } from "@jsonforms/react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useMemo } from "react";
import { DmInputProps } from "./DmInputProps";
import { InputCoercionFunction } from "./InputCoercionFunction";

function stringifyValue(value) {
  if (value === true) return "true";
  if (value === false) return "false";
  if (value === null) return "null";
  if (value === undefined) return "";
  return "";
}

function parseValue(stringValue) {
  if (stringValue === "true") return true;
  if (stringValue === "false") return false;
  if (stringValue === "null") return null;
  if (stringValue === "") return undefined;
  return undefined;
}

export const booleanCoercionFunction: InputCoercionFunction = (givenValue) => {
  if (typeof givenValue === "boolean") {
    return givenValue;
  }
  if (typeof givenValue === "number") {
    return givenValue !== 0;
  }
  return parseValue(String(givenValue).toLowerCase());
};

export function ControlInputBoolean(
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
    isFieldActive,
  } = props;

  const isNullable =
    Array.isArray(schema.type) && schema.type.indexOf("null") !== -1;

  function onChangeInterceptor(e, newValue) {
    // no button depressed (null) means not-filled-out (undefined)
    if (newValue === null) newValue = ""; // parsed as undefined

    newValue = parseValue(newValue);

    observeChange(newValue);
    handleChange(path, newValue);
  }

  const trueLabel = useMemo(
    () => t("boolean.true", "Yes", { schema, uischema, path }),
    [t, schema, uischema, path],
  );

  const falseLabel = useMemo(
    () => t("boolean.false", "No", { schema, uischema, path }),
    [t, schema, uischema, path],
  );

  const nullLabel = useMemo(
    () => t("boolean.null", "Unknown", { schema, uischema, path }),
    [t, schema, uischema, path],
  );

  return (
    <>
      <ToggleButtonGroup
        value={stringifyValue(data)}
        exclusive
        onChange={onChangeInterceptor}
        onFocus={onFocus}
        id={htmlId}
        size="small"
        color={isFieldActive ? "primary" : "standard"}
      >
        <ToggleButton sx={{ px: 2 }} value={"true"}>
          {trueLabel}
        </ToggleButton>
        <ToggleButton sx={{ px: 2 }} value={"false"}>
          {falseLabel}
        </ToggleButton>
        {isNullable ? (
          <ToggleButton sx={{ px: 2 }} value={"null"}>
            {nullLabel}
          </ToggleButton>
        ) : null}
      </ToggleButtonGroup>
      <div style={{ flex: 1 }}></div>
    </>
  );
}
