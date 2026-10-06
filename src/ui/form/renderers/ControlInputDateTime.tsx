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

// 2026-10-06: Dropped the "Z" suffix from formats.
// The times are not in UTC really, they are in whatever the local time is.
// So the time zone should be missing, not set explicitly to "Z" (UTC).
const dataFormats = {
  date: "YYYY-MM-DD",
  time: "HH:mm:ss",
  "date-time": "YYYY-MM-DDTHH:mm:ss",
};

const pickerElements = {
  date: DatePicker,
  time: TimePicker,
  "date-time": DateTimePicker,
};

const _dateTimeParser = (data: string): moment.Moment | null => {
  const m = moment(data);
  if (m && !m.isValid()) return null;
  return m;
};

const dataParsers = {
  date: (data: string) => {
    return _dateTimeParser(data + "T" + moment().format(dataFormats["time"]));
  },
  time: (data: string) => {
    return _dateTimeParser(moment().format(dataFormats["date"]) + "T" + data);
  },
  "date-time": _dateTimeParser,
};

// NOTE: not a "InputCoercionFunction", since it needs one more argument
// to be passed, with valid options; is specified in the DmDateTimeControl file
export const dateTimeCoercionPseudofunction = (
  givenValue: any,
  pickerVariant: PickerVariant,
): string | null | undefined => {
  // dataParsers above are for parsing the string data returned by
  // the UI picker element. This coercion function is used to parse
  // data returned by the automatic robot prediction. So this logic
  // here must be more benevolent in what it accepts.
  // Also, it does not return a moment instance, but a string instead.

  // missing
  if (givenValue === undefined) return undefined;
  if (givenValue === "") return undefined;

  // explicitly unknown
  if (givenValue === null) return null;

  // try parsing as valid date/time string
  // and formatting in the expected format
  const m = moment(givenValue);
  if (m && m.isValid()) {
    return m.format(dataFormats[pickerVariant]);
  }

  // invalid string, treat as missing value
  return undefined;
};

export type PickerVariant = "date" | "time" | "date-time";

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
  } = props;

  const { i18n } = useTranslation();

  // "date", "time", "date-time"
  const pickerVariant: PickerVariant =
    (schema.format as PickerVariant) || "date-time";

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
  const parsedData: moment.Moment | null = debouncedData
    ? dataParsers[pickerVariant](debouncedData)
    : null;

  // private value holds invalid moment instances, whereas the publically
  // shown value only contains valid values or undefineds
  const [privateValue, setPrivateValue] = useState<moment.Moment | null>(
    parsedData,
  );

  // what to show in the picker
  let displayedValue: moment.Moment | null = null;
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
  function onPickerChange(newValue: moment.Moment) {
    if (newValue) {
      newValue.utcOffset(0, true); // forget timezone (pretend it's UTC)
      newValue.second(0); // forget sub-minute time
      newValue.millisecond(0);
    }

    setPrivateValue(newValue);

    // transform to public value (valid ISO string or undefined)
    let newData: string | undefined = undefined;
    if (newValue && newValue.isValid()) {
      newData = newValue.format(dataFormats[pickerVariant]);
    }

    // propagate upwards if needed
    if (newData !== debouncedData) {
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
