import * as styles from "./renderers.module.scss"
import { FormHelperText, InputLabel, Divider, Paper, IconButton, ToggleButton, InputBase } from "@mui/material"
import { isIntegerControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps } from "@jsonforms/react"
import SmartToyIcon from '@mui/icons-material/SmartToy'
import CheckIcon from '@mui/icons-material/Check'
import FlagIcon from '@mui/icons-material/Flag'
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags'
import { FieldState } from "../FieldState"
import { useDebouncedChange } from "@jsonforms/material-renderers/src/util/debounce"
import { useFieldActivity } from "../useFieldActivity"
import { useFieldState } from "../useFieldState"
import { useCallback } from "react"

const toNumber = (value) => value === '' ? undefined : parseInt(value, 10)
const eventToValue = (e) => toNumber(e.target.value)

export function ResqIntegerControl(props) {
  const {
    data,
    label,
    errors,
    id,
    enabled,
    uischema,
    path,
    handleChange
  } = props

  const fieldId = id
  const htmlId = id + "-input"

  const {
    isFieldActive,
    toggleFieldActivity,
    setFieldActive
  } = useFieldActivity(fieldId)

  const {
    hasRobotValue,
    isVerified,
    hasVerifiedAppearance,
    toggleRobotVerified,
    updateFieldStateWithChange
  } = useFieldState(fieldId, isFieldActive)

  const [inputValue, onChange] = useDebouncedChange(
    handleChange, '', data, path, eventToValue
  )

  function onChangeInterceptor(e) {
    const newData = eventToValue(e)
    updateFieldStateWithChange(newData)
    onChange(e)
  }

  function onFocus() {
    setFieldActive()
  }

  return (
    <Paper>
      <InputLabel
        className={styles["field-label"]}
        htmlFor={htmlId}
      >{ label || `[${id}]` }</InputLabel>
      <Divider/>
      <div className={[
        styles["field-row"],
        isFieldActive ? styles["field-row--active"] : "",
        hasVerifiedAppearance ? styles["field-row--verified"] : ""
      ].join(" ")}>

        <InputBase
          type="number"
          value={inputValue}
          onChange={onChangeInterceptor}
          onFocus={onFocus}
          id={htmlId}
          disabled={!enabled}
          fullWidth={true}
          placeholder="Enter a number..."
        />

        {/* Activity flag button */}
        <IconButton
          onClick={toggleFieldActivity}
          sx={{ p: '10px' }}
          className={styles["field-flag-button"]}
        >
          {isFieldActive ? <FlagIcon /> : <EmojiFlagsIcon />}
        </IconButton>

        {/* Robot value verification button */}
        { hasRobotValue ? (
          <ToggleButton
            size="small"
            color={hasVerifiedAppearance ? "success" : "primary"}
            value="check"
            selected={isVerified}
            onChange={toggleRobotVerified}
          >
            <SmartToyIcon />
            <CheckIcon />
          </ToggleButton>
        ) : ""}

      </div>
      { errors === "" ? "" : (
        <FormHelperText
          className={styles["field-error-message"]}
          error={true}
        >{errors}</FormHelperText>
      )}
    </Paper>
  )
}

export const resqIntegerControlTester = rankWith(
  1, isIntegerControl
)

export default withJsonFormsControlProps(ResqIntegerControl)
