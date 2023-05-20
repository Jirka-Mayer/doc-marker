import React from "react"
import * as styles from "../renderers.module.scss"
import { rankWith, isBooleanControl } from '@jsonforms/core'
import { withJsonFormsControlProps, withTranslateProps } from '@jsonforms/react'
import { FormHelperText, Divider, IconButton, FormControlLabel, InputLabel, Radio, RadioGroup, Tooltip } from '@mui/material'
import { useMemo } from "react"
import { useFieldActivity } from '../../useFieldActivity'
import StreamIcon from '@mui/icons-material/Stream'
import { exportValue } from "../../../../state/formStore"
import { useHighlightPinButton } from "../../useHighlightPinButton"

function stringifyValue(value) {
  if (value === true) return "yes"
  if (value === false) return "no"
  if (value === null) return "null"
  if (value === undefined) return ""
  return ""
}

function parseValue(stringValue) {
  if (stringValue === "yes") return true
  if (stringValue === "no") return false
  if (stringValue === "null") return null
  if (stringValue === "") return undefined
  return undefined
}

function schemaAllowsNullability(schema) {
  if (!Array.isArray(schema.type)) return false
  return schema.type.indexOf("null") !== -1
}

function LeaderControl(props) {
  const {
    path,
    schema,
    uischema,
    label,
    id,
    data,
    visible,
    t,
    errors,
    handleChange
  } = props

  const fieldId = path // field ID is defined to be the path in the form data
  const htmlId = id + "-input"

  const isNullable = schemaAllowsNullability(schema)


  // === field activity ===

  const {
    isFieldActive,
    toggleFieldActivity,
    setFieldActive
  } = useFieldActivity(fieldId)


  // === field state ===

  /*
    I guess it doesn't make sense for the leader to have field state.
    Automatic extraction will be performed for individual checkboxes
    and this value is then extracted from that, I guess?
  */

  const hasVerifiedAppearance = false


  // === field highlights ===

  const { HighlightPinButton } = useHighlightPinButton({
    ...props,
    fieldId
  })


  // === value export ===

  exportValue(path,
    visible ? data : undefined
  )


  /////////////
  // Actions //
  /////////////

  function onFocus() {
    setFieldActive()
  }

  function onRadioButtonChange(e) {
    const newValue = parseValue(e.target.value)
    handleChange(path, newValue)
  }


  ///////////////
  // Rendering //
  ///////////////

  const labelYes = useMemo(() => t(
    path + ".yes", "Yes", { schema, uischema, path}
  ), [t, schema, uischema, path])
  const labelNo = useMemo(() => t(
    path + ".no", "No", { schema, uischema, path}
  ), [t, schema, uischema, path])
  const labelNull = useMemo(() => t(
    path + ".null", "Unknown", { schema, uischema, path}
  ), [t, schema, uischema, path])

  const forgetTooltipLabel = useMemo(() => t(
    "multiselect.forget",
    "Forget value",
    { schema, uischema, path}
  ), [t, schema, uischema, path])

  return (
    <div onClick={() => setFieldActive()}>
      <InputLabel
        className={styles["field-label"]}
        htmlFor={htmlId}
      >{ label || `${fieldId}` }</InputLabel>
      <Divider />

      <div
        className={[
          styles["field-row"],
          isFieldActive ? styles["field-row--active"] : "",
          hasVerifiedAppearance ? styles["field-row--verified"] : ""
        ].join(" ")}
      >
        <RadioGroup
          name={htmlId}
          value={stringifyValue(data)}
          onChange={onRadioButtonChange}
          onFocus={onFocus}
        >
          <FormControlLabel value="yes" control={<Radio />} label={labelYes} />
          <FormControlLabel value="no" control={<Radio />} label={labelNo} />
          { isNullable ?
            <FormControlLabel value="null" control={<Radio />} label={labelNull} />
          : null }
        </RadioGroup>

        <div style={{ flex: "1" }}></div>

        {/* Reset to empty button */}
        { (data !== undefined) &&
          <Tooltip
            title={forgetTooltipLabel}
            disableInteractive
          >
            <IconButton
              onClick={() => handleChange(path, undefined)}
              sx={{ p: '10px' }}
            >
              <StreamIcon />
            </IconButton>
          </Tooltip>
        }

        <HighlightPinButton/>

        {/* NOTE: robot validation button is missing because field state is missing */}

      </div>
      { (errors !== "") &&
        <FormHelperText
          className={styles["field-error-message"]}
          error={true}
        >{errors}</FormHelperText>
      }
    </div>
  )
}

export const leaderControlTester = rankWith(
  2, isBooleanControl
)

export default withJsonFormsControlProps(
  withTranslateProps(
    React.memo(LeaderControl)
  )
)
