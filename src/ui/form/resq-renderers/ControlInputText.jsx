import { InputBase } from "@mui/material"
import { useDebouncedChange } from "@jsonforms/material-renderers/src/util/debounce"
import { useMemo } from "react"

const eventToValue = (e) => e.target.value === "" ? undefined : e.target.value

export function ControlInputText(props) {
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
    observeChange
  } = props

  const [inputValue, onChange] = useDebouncedChange(
    handleChange, '', data, path, eventToValue
  )

  function onChangeInterceptor(e) {
    observeChange(eventToValue(e))
    onChange(e)
  }

  const placeholder = useMemo(() => t(
    "text.placeholder",
    "Enter text...",
    { schema, uischema, path}
  ), [t, schema, uischema, path])

  return (
    <InputBase
      value={inputValue}
      onChange={onChangeInterceptor}
      onFocus={onFocus}
      id={htmlId}
      fullWidth={true}
      placeholder={placeholder}
    />
  )
}