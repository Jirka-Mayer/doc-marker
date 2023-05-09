import { InputBase } from "@mui/material"
import { useDebouncedChange } from "@jsonforms/material-renderers/src/util/debounce"
import { useMemo } from "react"

const toNumber = (value) => value === '' ? undefined : parseInt(value, 10)
const eventToValue = (e) => toNumber(e.target.value)

export function ControlInputInteger(props) {
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
    "integer.placeholder",
    "Enter a number...",
    { schema, uischema, path}
  ), [t, schema, uischema, path])

  return (
    <InputBase
      type="number"
      value={inputValue}
      onChange={onChangeInterceptor}
      onFocus={onFocus}
      id={htmlId}
      fullWidth={true}
      placeholder={placeholder}
    />
  )
}