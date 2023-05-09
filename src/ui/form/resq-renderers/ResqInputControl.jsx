import * as styles from "./renderers.module.scss"
import { FormHelperText, InputLabel, Divider, Paper, IconButton, ToggleButton, InputBase, Tooltip } from "@mui/material"
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
import HideSourceIcon from '@mui/icons-material/HideSource';
import { useState } from 'react';
import { useMemo } from 'react';
import { useEffect } from "react"
import { useCallback } from "react"

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
    schema,
    uischema,
    visible,
    path,
    t,
    handleChange: publicHandleChange,
    controlInput: InnerComponent,
  } = props

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


  /////////////////
  // Nullability //
  /////////////////

  const isNullable = Array.isArray(schema.type)
    && schema.type.indexOf("null") !== -1;

  const [isNull, setNull] = useState(data === null)


  /////////////////////////////////////
  // Private-public value separation //
  /////////////////////////////////////

  /*
    The control separates the value it holds internally, from the value it
    shows to the world publicly. This is so that we can make the value unknown
    or missing to the public, while still remembering the original value.

    The separation is done by remembering both values and intercepting/emitting
    the handleChange events accordingly.
  */

  // NOTE: publicValue = data, setPublicValue = publicHandleChange
  const [privateValue, setPrivateValue] = useState(data)

  function computePublicValue() {
    if (!visible)
      return undefined
    if (isNullable && isNull)
      return null
    return privateValue
  }

  const privateHandleChange = useCallback((p, v) => {
    if (p === path) {
      // remember
      setPrivateValue(v)

      // pass through only if having as usual (visible & not null)
      // (no need to be perfect, the useEffect below ensures consistency,
      // this is just to save some re-renders)
      if (visible && !(isNullable && isNull)) {
        publicHandleChange(p, v)
      }
    } else {
      // pass-thru
      publicHandleChange(p, v)
    }
  }, [visible, isNullable, isNull, path])

  // makes sure the public value always stays consistent
  // (e.g. visibility may change without our knowledge, we need to react)
  useEffect(() => {
    const computedPublicValue = computePublicValue()
    if (computedPublicValue !== data) {
      publicHandleChange(path, computedPublicValue)
    }
  })


  /////////////
  // Actions //
  /////////////

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


  /////////////////////////
  // Props for the child //
  /////////////////////////

  const controlInputProps = {
    ...props,

    // intercepted jsonforms props
    handleChange: privateHandleChange,
    data: privateValue,

    // doc-marker
    fieldId,
    htmlId,
    onFocus,
    observeChange,
    isFieldActive,
    hasVerifiedAppearance,
  }


  ///////////////
  // Rendering //
  ///////////////

  const unknownValueLabel = useMemo(() => t(
    "unknown.value",
    "Unknown",
    { schema, uischema, path}
  ), [t, schema, uischema, path])

  const unknownTooltipLabel = useMemo(() => t(
    "unknown.tooltip",
    "Set as unknown",
    { schema, uischema, path}
  ), [t, schema, uischema, path])

  return (
    <Paper
      sx={{ display: visible ? "block" : "none" }}
      onClick={() => setFieldActive()}
    >
      <InputLabel
        className={styles["field-label"]}
        htmlFor={htmlId}
      >{ label || `${fieldId}` }</InputLabel>
      <Divider/>
      <div className={[
        styles["field-row"],
        isFieldActive ? styles["field-row--active"] : "",
        hasVerifiedAppearance ? styles["field-row--verified"] : ""
      ].join(" ")}>

        {/* Nullability */}
        { isNullable ? (
          <Tooltip
            title={unknownTooltipLabel}
            disableInteractive
          >
            <ToggleButton
              className={styles["field-unknown-button"]}
              value="check"
              size="small"
              sx={{ mr: "10px" }}
              selected={isNull}
              onChange={() => {
                setNull(!isNull)
                setFieldActive()
              }}
            >
              <HideSourceIcon />
            </ToggleButton>
          </Tooltip>
        ) : null}

        {/* The child or "unknown" */}
        { (isNullable & isNull) ? (
          <InputBase
            value={unknownValueLabel}
            fullWidth={true}
          />
        ) : (
          <InnerComponent {...controlInputProps} />
        ) }

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
