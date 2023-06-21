import React from "react"
import { rankWith, isBooleanControl } from '@jsonforms/core'
import { withJsonFormsControlProps, withTranslateProps } from '@jsonforms/react'
import { Checkbox, FormControlLabel } from '@mui/material'
import { useCallback } from 'react'
import * as styles from "../renderers.module.scss"
import * as multiselectStyles from "../multiselect/multiselect.module.scss"
import { useFieldActivity } from '../../useFieldActivity'
import { useFieldState } from '../../useFieldState'
import { useExportValue } from '../../../../state/form/formDataStore'
import { useHighlightPinButton } from "../../useHighlightPinButton"
import { useContext } from "react"
import { PostAcuteFindingsContext } from "./PostAcuteFindingsContext"

export function CheckboxControl(props) {
  const {
    path,
    label,
    data,
    id,
    handleChange,
    visible,
    uischema
  } = props

  const {
    groupVisible
  } = useContext(PostAcuteFindingsContext)

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

  useExportValue(path,
    groupVisible
      ? !!data
      : undefined
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
  }, [handleChange, path])


  ///////////////
  // Rendering //
  ///////////////
  
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
        checked={data === true}
        onChange={privateHandleChange}
        color={hasVerifiedAppearance ? "success" : "primary"}
        onFocus={onFocus}
      />
      <FormControlLabel
        control={<span></span>} // not the checkbox to disable "click label to check"
        label={label || fieldId}
        style={{ marginLeft: 0 }}
      />

      <HighlightPinButton/>

      {/* TODO: robot validation button */}
    </div>
  )
}

export const checkboxControlTester = rankWith(
  2, isBooleanControl
)

export default withJsonFormsControlProps(
  withTranslateProps(
    React.memo(CheckboxControl)
  )
)
