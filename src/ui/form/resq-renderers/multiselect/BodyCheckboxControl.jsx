import React from "react"
import { rankWith, isBooleanControl } from '@jsonforms/core'
import { withJsonFormsControlProps, withTranslateProps } from '@jsonforms/react'
import { Checkbox, FormControlLabel } from '@mui/material'
import { useContext, useCallback } from 'react'
import { MultiselectGroupContext } from './MultiselectGroupContext'
import * as styles from "../renderers.module.scss"
import * as multiselectStyles from "./multiselect.module.scss"
import { useFieldActivity } from '../../useFieldActivity'
import { useFieldState } from '../../useFieldState'
import { exportValue } from '../../../../state/form/formDataStore'
import { useHighlightPinButton } from "../../useHighlightPinButton"

export function BodyCheckboxControl(props) {
  const {
    path,
    uischema,
    label,
    data,
    id,
    handleChange
  } = props

  const {
    leaderValue,
    leaderPath,
    inSubGroup
  } = useContext(MultiselectGroupContext)

  const fieldId = path // field ID is defined to be the path in the form data
  const htmlId = id + "-input"


  // === field activity ===

  const {
    isFieldActive,
    toggleFieldActivity,
    setFieldActive
  } = useFieldActivity(fieldId)


  // === field state ===

  const {
    hasRobotValue,
    isVerified,
    hasVerifiedAppearance,
    toggleRobotVerified,
    updateFieldStateWithChange
  } = useFieldState(fieldId, isFieldActive)


  // === field highlights ===

  const { HighlightPinButton } = useHighlightPinButton({
    ...props,
    fieldId
  })


  // === value export ===

  exportValue(path,
    leaderValue === true
      ? !!data
      : leaderValue
  )


  /////////////
  // Actions //
  /////////////

  function onFocus() {
    setFieldActive()
  }

  const privateHandleChange = useCallback((e) => {
    const isChecked = e.target.checked
    
    // "observeChange" (treat false as empty)
    updateFieldStateWithChange(isChecked ? true : undefined)
    
    handleChange(path, isChecked)

    // when we set the checkbox to true and the leader is not checked, we check it
    if (isChecked && leaderValue !== true) {
      handleChange(leaderPath, true)
    }
  }, [handleChange, path])


  ///////////////
  // Rendering //
  ///////////////
  
  const enabled = (leaderValue !== undefined)

  const checked = enabled
    ? (data === true) // enabled --> display the "data" value
    : false // disabled --> display as empty

  return (
    <div
      className={[
        styles["field-row"],
        isFieldActive ? styles["field-row--active"] : "",
        hasVerifiedAppearance ? styles["field-row--verified"] : "",
        multiselectStyles["checkbox-row"]
      ].join(" ")}
      onClick={() => setFieldActive()}
    >
      <Checkbox
        id={htmlId}
        checked={checked}
        onChange={privateHandleChange}
        disabled={!enabled}
        color={hasVerifiedAppearance ? "success" : "primary"}
        onFocus={onFocus}
      />
      <FormControlLabel
        control={<span></span>} // not the checkbox to disable "click label to check"
        label={label || fieldId}
        disabled={!enabled}
        style={{ marginLeft: 0 }}
      />

      <HighlightPinButton/>

      {/* TODO: robot validation button */}
    </div>
  )
}

export const bodyCheckboxControlTester = rankWith(
  2, isBooleanControl
)

export default withJsonFormsControlProps(
  withTranslateProps(
    React.memo(BodyCheckboxControl)
  )
)
