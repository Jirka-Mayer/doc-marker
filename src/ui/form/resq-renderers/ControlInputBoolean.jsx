import { ToggleButton, ToggleButtonGroup } from "@mui/material"

export function ControlInputBoolean(props) {
  const {
    // json forms
    data,
    path,
    handleChange,

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
          yes
        </ToggleButton>
        <ToggleButton sx={{px: 2}} value={false}>
          no
        </ToggleButton>
      </ToggleButtonGroup>
      <div style={{flex: 1}}></div>
    </>
  )
}