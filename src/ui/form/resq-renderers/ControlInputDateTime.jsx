import moment from 'moment';
import { InputBase, TextField, ToggleButton } from "@mui/material"
import { useDebouncedChange } from "@jsonforms/material-renderers/src/util/debounce"
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';
import HideSourceIcon from '@mui/icons-material/HideSource';
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

  const [isUnknown, setUnknown] = useState(data === null)
  const [localValue, setLocalValue] = useState(moment('2022-04-07'))

  function emitNewState() {
    let publicValue = undefined
    if (isUnknown) {
      publicValue = null
    } else if (localValue && localValue.isValid()) {
      publicValue = localValue.toISOString()
    }
    
    observeChange(publicValue)
    handleChange(path, publicValue)
  }

  return (<>
    <ToggleButton // TODO: unknown only when nullable, not always ++ make it a component!
      className={styles["field-unknown-button"]}
      value="check"
      size="small"
      sx={{ mr: 2 }}
      selected={isUnknown}
      onChange={() => {
        setUnknown(!isUnknown)
        emitNewState()
      }}
    >
      <HideSourceIcon />
    </ToggleButton>

    { isUnknown ? (
      <InputBase
        value="Unknown" // TODO: translate
        fullWidth={true}
      />
    ) : (
      <div className={styles["field-datetime-container"]}>
        <LocalizationProvider dateAdapter={AdapterMoment}> {/* TODO: localization */}
          <DateTimePicker // TODO: other picker variants
            // onFocus={onFocus} // TODO: field highlight on focus
            value={localValue}
            onChange={(newValue) => {
              console.log(newValue) // TODO: remove when unnecessary
              setLocalValue(newValue)
              emitNewState()
            }}
          />
        </LocalizationProvider>
      </div>
    ) }
  </>)
}