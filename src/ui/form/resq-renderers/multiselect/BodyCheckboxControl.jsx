import { rankWith, isBooleanControl } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { Checkbox, FormControlLabel, IconButton } from '@mui/material'
import { useContext, useState, useCallback, useEffect } from 'react'
import { MultiselectGroupContext } from './MultiselectGroupContext'
import * as styles from "../renderers.module.scss"
import { useFieldActivity } from '../../useFieldActivity'
import { useFieldState } from '../../useFieldState'
import { useFieldHighlights } from '../../useFieldHighlights'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FlagIcon from '@mui/icons-material/Flag'
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags'
import { quillExtended } from "../../../../state/reportStore"

export function BodyCheckboxControl(props) {
  const {
    path,
    uischema,
    label,
    data,
    visible,
    id,
    handleChange: publicHandleChange
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


  /////////////////////////////////////
  // Private-public value separation //
  /////////////////////////////////////

  // NOTE: publicValue = data, setPublicValue = publicHandleChange
  const [privateValue, setPrivateValue] = useState(!!data) // enforce boolean

  function computePublicValue() {
    if (leaderValue === false)
      return false
    if (leaderValue === null)
      return null
    if (leaderValue === undefined)
      return undefined
    return !!privateValue // enforce boolean
  }

  const privateHandleChange = useCallback((e) => {
    const isChecked = e.target.checked

    // "observeChange" (treat false as empty)
    updateFieldStateWithChange(isChecked ? true : undefined)

    // remember
    setPrivateValue(isChecked)

    // pass through only if the leader is "yes"
    if (leaderValue === true) {
      publicHandleChange(path, isChecked)
    }
  }, [leaderValue, path])

  // makes sure the public value always stays consistent
  // (e.g. leader value may change without our knowledge, we need to react)
  useEffect(() => {
    const computedPublicValue = computePublicValue()
    if (computedPublicValue !== data) {
      publicHandleChange(path, computedPublicValue)
    }
  })


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
        hasVerifiedAppearance ? styles["field-row--verified"] : ""
      ].join(" ")}
      onClick={() => setFieldActive()}
    >
      <FormControlLabel
        control={
          <Checkbox
            id={htmlId}
            checked={data === true}
            onChange={privateHandleChange}
            color={hasVerifiedAppearance ? "success" : "primary"}
            onFocus={onFocus}
          />
        }
        label={label || fieldId}
      />

      <div style={{ flex: "1" }}></div>

      {/* Activity flag button */}
      <IconButton
        onClick={(e) => { e.stopPropagation(); toggleFieldActivity() }}
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
