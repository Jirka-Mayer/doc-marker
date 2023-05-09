import { ToggleButton, ToggleButtonGroup } from "@mui/material"
import { useMemo } from "react"

export function ControlInputBoolean(props) {
  const {
    // json forms
    data,
    path,
    handleChange,
    schema,
    uischema,
    t,

    // resq
    htmlId,
    onFocus,
    observeChange,
    isFieldActive,
    hasVerifiedAppearance
  } = props

  function onChangeInterceptor(e, newValue) {
    // no button depressed (null) means not-filled-out (undefined)
    if (newValue === null)
      newValue = undefined
    
    observeChange(newValue)
    handleChange(path, newValue)
  }

  const trueLabel = useMemo(() => t(
    "boolean.true",
    "Yes",
    { schema, uischema, path}
  ), [t, schema, uischema, path])

  const falseLabel = useMemo(() => t(
    "boolean.false",
    "No",
    { schema, uischema, path}
  ), [t, schema, uischema, path])

  const nullLabel = useMemo(() => t(
    "boolean.null",
    "Unknown",
    { schema, uischema, path}
  ), [t, schema, uischema, path])

  return (
    <>
      <ToggleButtonGroup
        value={data}
        exclusive
        onChange={onChangeInterceptor}
        onFocus={onFocus}
        id={htmlId}
        size="small"
        color={
          isFieldActive ? "primary" : (
            hasVerifiedAppearance ? "success" : "standard"
          )
        }
      >
        <ToggleButton sx={{px: 2}} value={true}>
          { trueLabel }
        </ToggleButton>
        <ToggleButton sx={{px: 2}} value={false}>
          { falseLabel }
        </ToggleButton>
      </ToggleButtonGroup>
      <div style={{flex: 1}}></div>
    </>
  )
}