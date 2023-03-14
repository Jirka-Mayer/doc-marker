import * as styles from "./renderers.module.scss"
import { FormHelperText, InputLabel, Divider, Paper, IconButton, ToggleButton } from "@mui/material"
import SmartToyIcon from '@mui/icons-material/SmartToy'
import CheckIcon from '@mui/icons-material/Check'
import FlagIcon from '@mui/icons-material/Flag'
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags'
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useFieldActivity } from "../useFieldActivity"
import { useFieldState } from "../useFieldState"
import { useFieldHighlights } from "../useFieldHighlights"
import { quillExtended } from "../../../state/reportStore"

/**
 * Wrapper for all input controls that have the "label : field : errors" structure
 * where the field is a text/integer/select input (any one-line input).
 * The control "input" element is passed as a prop "controlInput"
 * and inside used as "InnerComponent"
 */
export function ResqInputControl(props) {
  const {
    data,
    label,
    errors,
    id,
    uischema,
    visible,
    path,
    handleChange,
    controlInput: InnerComponent,
    controlInputProps: controlInputPropsGiven
  } = props

  const fieldId = path // field ID is defined to be the path in the form data
  const htmlId = id + "-input"

  const isEmpty = data === undefined

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

  const {
    highlightsRanges,
    hasHighlights
  } = useFieldHighlights(fieldId)

  // called with onChange before input debouncing and handleChange
  function observeChange(newData) {
    updateFieldStateWithChange(newData)
  }

  function onFocus() {
    setFieldActive()
  }

  function onHighlightPinClick() {
    quillExtended.scrollHighlightIntoView(fieldId)
  }

  const controlInputProps = {
    // given props
    ...controlInputPropsGiven,

    // json forms
    data,
    path,
    handleChange,

    // resq
    htmlId,
    onFocus,
    observeChange,
    isFieldActive,
    hasVerifiedAppearance,
  }

  return (
    <Paper sx={{ display: visible ? "block" : "none" }}>
      <InputLabel
        className={styles["field-label"]}
        htmlFor={htmlId}
      >{ uischema.label || `${fieldId}` }</InputLabel>
      <Divider/>
      <div className={[
        styles["field-row"],
        isFieldActive ? styles["field-row--active"] : "",
        hasVerifiedAppearance ? styles["field-row--verified"] : ""
      ].join(" ")}>

        <InnerComponent {...controlInputProps} />

        {/* Activity flag button */}
        <IconButton
          onClick={toggleFieldActivity}
          sx={{ p: '10px' }}
          className={styles["field-flag-button"]}
        >
          {isFieldActive ? <FlagIcon /> : <EmojiFlagsIcon />}
        </IconButton>

        {/* Highlight pin button */}
        { hasHighlights ?
          <IconButton
            onClick={onHighlightPinClick}
            sx={{ p: '10px' }}
            // className={styles["field-highlights-button"]}
          >
            <LocationOnIcon />
          </IconButton>
        : ""}

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
