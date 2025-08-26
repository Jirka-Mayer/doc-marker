import * as styles from "./renderers.module.scss";
import { Select, MenuItem } from "@mui/material";
import { useMemo } from "react";
import { DmInputProps } from "./DmInputProps";
import { EnumCellProps } from "@jsonforms/core";
import { TranslateProps } from "@jsonforms/react";

const nullValueConstant = "null-" + Math.random().toString(36).substring(2, 7);

const eventToValue = (e) => {
  if (e.target.value == "") return undefined;

  if (e.target.value === nullValueConstant) return null;

  return e.target.value;
};

const valueToString = (v) => {
  if (v === undefined) return "";

  if (v === null) return nullValueConstant;

  return "" + v;
};

export function ControlInputSelect(
  props: EnumCellProps & TranslateProps & DmInputProps,
) {
  const {
    // json forms
    data,
    path,
    handleChange,
    schema,
    uischema,
    options,
    t,

    // DocMarker
    htmlId,
    onFocus,
    observeChange,
  } = props;

  function onChange(e) {
    let v = eventToValue(e);
    observeChange(v);
    handleChange(path, v);
  }

  const noneOptionLabel = useMemo(
    () => t("enum.none", "Select an option...", { schema, uischema, path }),
    [t, schema, uischema, path],
  );

  return (
    <div className={styles["field-select-container"]}>
      <Select
        id={htmlId}
        value={valueToString(data)}
        onChange={onChange}
        onFocus={onFocus}
        fullWidth={true}
        variant="standard"
        displayEmpty
      >
        <MenuItem value={""} key="jsonforms.enum.none">
          <em>{noneOptionLabel}</em>
        </MenuItem>
        {options!.map((optionValue) => (
          <MenuItem
            value={valueToString(optionValue.value)}
            key={valueToString(optionValue.value)}
          >
            {optionValue.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
