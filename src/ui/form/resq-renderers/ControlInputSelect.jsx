import * as styles from "./renderers.module.scss"
import { Select, MenuItem } from "@mui/material"

const eventToValue = (e) => e.target.value || undefined

export function ControlInputSelect(props) {
  const {
    // json forms
    data,
    path,
    handleChange,

    // resq
    htmlId,
    onFocus,
    observeChange,

    // select constrol input
    optionValues,
    optionLabels
  } = props

  function onChange(e) {
    let v = eventToValue(e)
    observeChange(v)
    handleChange(path, v)
  }

  const noneOptionLabel = "Select an option..."

  // TODO: read through the documentation of MUI select and fine-tune
  // all the settings related to "placeholder", missing value, selected null,
  // missing translation, etc...

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
        renderValue={(selected) => selected
          ? (optionLabels[selected] || `[${selected}]`)
          : <em>{noneOptionLabel}</em>
        }
      >
        {[<MenuItem value={''} key='jsonforms.enum.none'><em>{noneOptionLabel}</em></MenuItem>].concat(
          optionValues.map(optionValue => (
            <MenuItem value={optionValue} key={optionValue}>
              {optionLabels[optionValue] || `[${optionValue}]`}
            </MenuItem>
          ))
        )}
      </Select>
    </div>
  )
}