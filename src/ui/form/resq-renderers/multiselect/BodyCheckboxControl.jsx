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
import { usePrevious } from '../../../../utils/usePrevious'
import { useDebouncedChange } from '@jsonforms/material-renderers'

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


  /////////////////////////////////////
  // Public-private value separation //
  /////////////////////////////////////

  const publicValue = data
  const setPublicValue = useCallback((v) => {
    // console.log("SET", path, v)
    handleChange(path, v)
  }, [path, handleChange])

  // ------

  const bodyVisible = (leaderValue === true) // invisible if the leader isn't true

  const [cache, setCache] = useState(false)
  const [isCached, setIsCached] = useState(false)

  // ------

  const privateValue = isCached ? cache : publicValue
  const setPrivateValue = useCallback((v) => {
    if (isCached) {
      setCache(v)
    } else {
      setPublicValue(v)
    }
  }, [isCached, setCache, setPublicValue])

  // ------

  useEffect(() => {
    if (!isCached && !bodyVisible) {
      // console.log("CACHING", path, publicValue)
      setCache(publicValue)
      setPublicValue(leaderValue)
      setIsCached(true)
    }

    if (isCached && bodyVisible) {
      if (publicValue === leaderValue) {
        // console.log("RESTORING", path, publicValue)
        setPublicValue(cache)
        setIsCached(false)
      } else {
        // console.log("RESTORING", path, "SKIPPED RESTORATION")
        setIsCached(false)
      }
    }

    if (isCached && !bodyVisible && leaderValue !== publicValue) {
      // console.log("ALIGN", path, leaderValue)
      setPublicValue(leaderValue)
    }
  })

  // console.log("PUBLIC", publicValue, "<->", privateValue, "PRIVATE", path)


  // === visibility ===


  // const {
  //   privateValue: visibilityPrivateValue,
  //   privateHandleChange: visibilityPrivateHandleChange
  // } = useVisibilityMiddleware({
  //   publicValue: data,
  //   publicHandleChange: handleChange,
  //   path,
  //   visible: bodyVisible,
  //   // when the body is invisible, the pretend values are aligned with the leader
  //   publicValueWhenInvisible: bodyVisible ? undefined : leaderValue
  // })

  const privateHandleChange = useCallback((e) => {
    const isChecked = e.target.checked
    
    // "observeChange" (treat false as empty)
    updateFieldStateWithChange(isChecked ? true : undefined)
    
    //visibilityPrivateHandleChange(path, isChecked)
    setPrivateValue(isChecked)
  }, [setPrivateValue, /*visibilityPrivateHandleChange*/, path])

  // const privateValue = visibilityPrivateValue


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
