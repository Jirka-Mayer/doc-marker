import React from "react"
import { rankWith, isBooleanControl } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { Checkbox, FormControlLabel, IconButton, Typography } from '@mui/material'
import { useContext, useState, useCallback, useEffect } from 'react'
import { MultiselectGroupContext } from './MultiselectGroupContext'
import * as styles from "../renderers.module.scss"
import * as multiselectStyles from "./multiselect.module.scss"
import { useFieldActivity } from '../../useFieldActivity'
import { useFieldState } from '../../useFieldState'
import { useFieldHighlights } from '../../useFieldHighlights'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FlagIcon from '@mui/icons-material/Flag'
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags'
import { quillExtended } from "../../../../state/reportStore"
import { usePrevious } from '../../../../utils/usePrevious'
import { useDebouncedChange } from '@jsonforms/material-renderers'
import { exportValue } from '../../../../state/form/formDataStore'

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

  const {
    highlightsRanges,
    hasHighlights
  } = useFieldHighlights(fieldId)


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

  function onHighlightPinClick() {
    quillExtended.scrollHighlightIntoView(fieldId)
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

      {/* Activity flag button */}
      {/* <IconButton
        onClick={(e) => { e.stopPropagation(); toggleFieldActivity() }}
        sx={{ p: '10px' }}
        className={styles["field-flag-button"]}
      >
        {isFieldActive ? <FlagIcon /> : <EmojiFlagsIcon />}
      </IconButton> */}

      {/* Highlight pin button */}
      { hasHighlights ?
        <IconButton
          onClick={onHighlightPinClick}
          sx={{ p: '10px' }}
        >
          <LocationOnIcon />
        </IconButton>
      : ""}

      {/* TODO: robot validation button */}
    </div>
  )
}

export const bodyCheckboxControlTester = rankWith(
  2, isBooleanControl
)

export default withJsonFormsControlProps(
  React.memo(BodyCheckboxControl)
)
