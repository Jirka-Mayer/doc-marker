import moment from 'moment';
import { useDebouncedChange } from "@jsonforms/material-renderers/src/util/debounce"
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import * as styles from "./renderers.module.scss"

export function ControlInputDateTime(props) {
  const {
    // json forms
    data,
    path,
    handleChange,

    // resq
    htmlId,
    onFocus,
    observeChange
  } = props

  const value = moment(data)

  function onChange(newValue) {
    let newData = newValue.toISOString()
    
    observeChange(newData)
    handleChange(path, newData)
  }

  return (<>
    <div className={styles["field-datetime-container"]}>
      <LocalizationProvider dateAdapter={AdapterMoment}> {/* TODO: localization */}
        <DateTimePicker // TODO: other picker variants
          // onFocus={onFocus} // TODO: field highlight on focus
          value={value}
          onChange={(newValue) => {
            console.log(newValue) // TODO: remove when unnecessary
            onChange(newValue)
          }}
        />
      </LocalizationProvider>
    </div>
  </>)
}