import * as styles from "./renderers.module.scss";
import { Select, MenuItem } from "@mui/material";
import { useMemo } from "react";
import { DmInputProps } from "./DmInputProps";
import { EnumCellProps } from "@jsonforms/core";
import { TranslateProps } from "@jsonforms/react";
import { levenshtein } from "../../../utils/levenshtein";

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

// NOTE: not a "InputCoercionFunction", since it needs one more argument
// to be passed, with valid options; is specified in the DmEnumControl file
export const selectCoercionPseudofunction = (
  givenValue: any,
  optionValues: any[],
) => {
  // the value matches exactly the options, no need for coercion
  if (optionValues.includes(givenValue)) {
    return givenValue;
  }

  // there are no options, no way to perform coercion
  if (optionValues.length === 0) {
    return givenValue;
  }

  // map everything to string
  const needle: string = valueToString(givenValue);
  const hay: string[] = optionValues.map(valueToString);

  // find the closest option by levenshtein distance
  const hayDistances = hay.map((h) => levenshtein(needle, h));
  const index = hayDistances.indexOf(Math.min(...hayDistances));

  // return the value on that index
  return optionValues[index];
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
  } = props;

  function onChange(e) {
    let v = eventToValue(e);
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
