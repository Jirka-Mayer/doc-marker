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
import { useVisibilityMiddleware } from '../../useVisibilityMiddleware'

export function BodyCheckboxControl(props) {
  const {
    path,
    uischema,
    label,
    data,
    visible,
    id,
    handleChange
  } = props

  const {
    leaderValue
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


  // === visibility ===

  const {
    privateValue: visibilityPrivateValue,
    privateHandleChange: visibilityPrivateHandleChange
  } = useVisibilityMiddleware({
    publicValue: data,
    publicHandleChange: handleChange,
    path,
    visible: leaderValue === true, // invisible if the leader isn't true
    publicValueWhenInvisible: leaderValue // same value as the leader
  })

  const privateHandleChange = useCallback((e) => {
    const isChecked = e.target.checked
    
    // "observeChange" (treat false as empty)
    updateFieldStateWithChange(isChecked ? true : undefined)
    
    visibilityPrivateHandleChange(path, isChecked)
  }, [visibilityPrivateHandleChange, path])

  const privateValue = visibilityPrivateValue


  /////////////
  // Actions //
  /////////////

  function onFocus() {
    setFieldActive()
  }

  function onHighlightPinClick() {
    quillExtended.scrollHighlightIntoView(fieldId)
  }


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
        checked={privateValue === true}
        onChange={privateHandleChange}
        color={hasVerifiedAppearance ? "success" : "primary"}
        onFocus={onFocus}
      />
      <Typography component="label" variant="body1">
        {label || fieldId}
      </Typography>

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

export default withJsonFormsControlProps(BodyCheckboxControl)
