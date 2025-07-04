import * as styles from "./renderers.module.scss"
import { FormHelperText, InputLabel, Divider, Paper, ToggleButton, InputBase, Tooltip, alpha } from "@mui/material"
import SmartToyIcon from '@mui/icons-material/SmartToy'
import CheckIcon from '@mui/icons-material/Check'
import { useFieldActivity } from "../useFieldActivity"
import { useFieldState } from "../useFieldState"
import HideSourceIcon from '@mui/icons-material/HideSource';
import { useContext, useMemo } from 'react';
import { useNullabilityMiddleware } from "../useNullabilityMiddleware"
import { formStore, userPreferencesStore } from "../../../state"
import { useHighlightPinButton } from "../useHighlightPinButton"
import { useTheme } from "@emotion/react"
import { useAtom } from "jotai"
import { DocMarkerContext } from "../../DocMarkerContext"

/**
 * Wrapper for all input controls that have the "label : field : errors" structure
 * where the field is a text/integer/select input (any one-line input).
 * The control "input" element is passed as a prop "controlInput"
 * and inside used as "InnerComponent"
 */
export function DmInputControl(props) {
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
    ignoreNullability,
    handleChange,
    controlInput: InnerComponent,
  } = props

  const fieldId = path // field ID is defined to be the path in the form data
  const htmlId = id + "-input"

  // get access to the global context
  const dmCtx = useContext(DocMarkerContext);

  // === fields repository connection ===
  
  dmCtx.fieldsRepository.useFieldsRepositoryConnection({
    fieldId,
    data,
    visible,
    handleChange,
  });

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
    toggleRobotVerified,
    updateFieldStateWithChange
  } = useFieldState(fieldId, isFieldActive)


  // === field highlights ===

  const { HighlightPinButton } = useHighlightPinButton({
    ...props,
    fieldId
  })


  // === export value ===

  formStore.useExportValue(path,
    visible ? data : undefined
  )


  // === nullability ===

  const isNullable = ignoreNullability !== true
    && Array.isArray(schema.type)
    && schema.type.indexOf("null") !== -1;

  const {
    privateValue: nullabilityPrivateValue,
    privateHandleChange: nullabilityPrivateHandleChange,
    isNull, setNull
  } = useNullabilityMiddleware({
    publicValue: data,
    publicHandleChange: handleChange,
    path,
    isNullable
  })

  // === debugging ===

  const [displayDebugInfo] = useAtom(userPreferencesStore.displayDebugInfoAtom)


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


  /////////////////////////
  // Props for the child //
  /////////////////////////

  const controlInputProps = {
    ...props,

    // intercepted jsonforms props
    handleChange: nullabilityPrivateHandleChange,
    data: nullabilityPrivateValue,

    // doc-marker
    fieldId,
    htmlId,
    onFocus,
    observeChange,
    isFieldActive,
  }


  ///////////////
  // Rendering //
  ///////////////

  const theme = useTheme()

  let fieldBackground = null

  if (isFieldActive)
    fieldBackground = alpha(theme.palette.primary.main, 0.11)

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
      sx={{
        // visibility normally toggles "display: none",
        // but if the debug mode is enabled, invisible controls are
        // rendered, only at 50% opacity.
        display: (visible || displayDebugInfo) ? "block" : "none",
        opacity: (!visible && displayDebugInfo) ? 0.5 : undefined,

        // the controls themselves have margin, grid does not
        ml: 2, mt: 2
      }}
      onClick={() => setFieldActive()}
    >

      <InputLabel
        className={styles["field-label"]}
        htmlFor={htmlId}
      >{ label || `${fieldId}` }</InputLabel>
      <Divider/>
      <div
        className={[
          styles["field-row"],
          isFieldActive ? styles["field-row--active"] : "",
        ].join(" ")}
        style={{ background: fieldBackground }}
      >

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
              tabIndex={-1}
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

        <HighlightPinButton/>

        {/* Robot value verification button */}
        { hasRobotValue ? (
          <ToggleButton
            size="small"
            color="primary"
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
