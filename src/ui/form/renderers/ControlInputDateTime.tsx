import * as moment from "moment";
import { useDebouncedChange } from "../useDebounceChangeWithCancel";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useTranslation } from "react-i18next";
import * as styles from "./renderers.module.scss";
import { useState } from "react";
import { CellProps } from "@jsonforms/core";
import { DmInputProps } from "./DmInputProps";

// https://json-schema.org/understanding-json-schema/reference/string.html#dates-and-times
const dataFormats = {
  date: "YYYY-MM-DD",
  time: "HH:mm:ssZ",
  "date-time": "YYYY-MM-DDTHH:mm:ssZ",
};

const pickerElements = {
  date: DatePicker,
  time: TimePicker,
  "date-time": DateTimePicker,
};

const _dateTimeParser = (data) => {
  let m = moment(data);
  if (m && !m.isValid()) return null;
  return m;
};

const dataParsers = {
  date: (data) => {
    return _dateTimeParser(data + "T" + moment().format(dataFormats["time"]));
  },
  time: (data) => {
    return _dateTimeParser(moment().format(dataFormats["date"]) + "T" + data);
  },
  "date-time": _dateTimeParser,
};

export function ControlInputDateTime(props: CellProps & DmInputProps) {
  const {
    // json forms
    data: bouncyData,
    path,
    handleChange,
    schema,

    // DocMarker
    htmlId,
    onFocus,
    observeChange,
  } = props;

  const { i18n } = useTranslation();

  // "date", "time", "date-time"
  const pickerVariant = schema.format || "date-time";

  const PickerElement = pickerElements[pickerVariant];

  // input debouncing
  const [debouncedData, onChange] = useDebouncedChange(
    handleChange,
    "",
    bouncyData,
    path,
    (v) => v,
  );

  // parse input to null or valid moment instance
  const parsedData = debouncedData
    ? dataParsers[pickerVariant](debouncedData)
    : null;

  // private value holds invalid moment instances, whereas the publically
  // shown value only contains valid values or undefineds
  const [privateValue, setPrivateValue] = useState(parsedData);

  // what to show in the picker
  let displayedValue = null;
  if (parsedData === null) {
    if (privateValue && privateValue.isValid()) {
      displayedValue = null; // someone externally forced null
    } else {
      displayedValue = privateValue; // we are invalid, being edited
    }
  } else {
    displayedValue = parsedData; // we are getting a valid value
  }

  // when the picker value changes
  function onPickerChange(newValue) {
    if (newValue) {
      newValue.second(0);
      newValue.millisecond(0);
    }

    setPrivateValue(newValue);

    // transform to public value (valid ISO string or undefined)
    let newData = undefined;
    if (newValue && newValue.isValid()) {
      newData = newValue.format(dataFormats[pickerVariant]);
    }

    // propagate upwards if needed
    if (newData !== debouncedData) {
      observeChange(newData);
      onChange(newData);
    }
  }

  return (
    <>
      <div className={styles["field-datetime-container"]}>
        <LocalizationProvider
          dateAdapter={AdapterMoment}
          adapterLocale={i18n.language}
        >
          <PickerElement
            slotProps={{
              textField: {
                onFocus: onFocus,
              },
            }}
            value={displayedValue}
            onChange={(v) => {
              onPickerChange(v);
            }}
          />
        </LocalizationProvider>
      </div>
    </>
  );
}
