import * as styles from "./renderers.module.scss"
import { Select, MenuItem } from "@mui/material"
import { useMemo } from "react"

const eventToValue = (e) => e.target.value || undefined

export function ControlInputSelect(props) {
  const {
    // json forms
    data,
    path,
    handleChange,
    schema,
    uischema,
    options,
    t,

    // resq
    htmlId,
    onFocus,
    observeChange,
  } = props

  function onChange(e) {
    let v = eventToValue(e)
    observeChange(v)
    handleChange(path, v)
  }

  const noneOptionLabel = useMemo(() => t(
    "enum.none",
    "Select an option...",
    { schema, uischema, path}
  ), [t, schema, uischema, path])

  return (
    <div className={styles["field-select-container"]}>
      <Select
        id={htmlId}
        value={data !== undefined ? data : ''}
        onChange={onChange}
        onFocus={onFocus}
        fullWidth={true}
        variant="standard"
        displayEmpty
      >
        <MenuItem value={''} key='jsonforms.enum.none'><em>{noneOptionLabel}</em></MenuItem>
        {options.map(optionValue => (
          <MenuItem value={optionValue.value} key={optionValue.value}>
            {optionValue.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}