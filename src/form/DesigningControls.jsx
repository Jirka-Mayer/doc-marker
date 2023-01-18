import * as styles from "./DesigningControls.module.scss"
import { Button, Divider, FormGroup, Paper, IconButton, ToggleButton } from "@mui/material"
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import FlagIcon from '@mui/icons-material/Flag'
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from "react"

function CheckboxRow({ fieldName, activeField, setActiveField, label }) {
  
  const [isVerified, setVerified] = useState(false)

  const isActive = activeField === fieldName
  
  function activateMe() {
    setActiveField(fieldName)
  }

  return (
    <div className={[
      styles["checkbox-row"],
      isActive ? styles["checkbox-row--active"] : "",
      isVerified ? styles["checkbox-row--verified"] : ""
    ].join(" ")}>
      <FormControlLabel control={<Checkbox color={isVerified ? "success" : "primary"} />} label={label} />
      
      <div className={styles["checkbox-row__whitespace"]}></div>

      <IconButton
        onClick={activateMe}
        sx={{ p: '10px' }}
        className={styles["checkbox-row__flag-button"]}
      >
        {isActive ? <FlagIcon /> : <EmojiFlagsIcon />}
      </IconButton>

      <ToggleButton
        size="small"
        color={isVerified ? "success" : "primary"}
        selected={isVerified}
        onChange={() => {setVerified(!isVerified)}}
      >
        <SmartToyIcon />
        <CheckIcon />
      </ToggleButton>

      {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}
    </div>
  )
}

export function DesigningControls() {
  const [activeField, setActiveField] = useState("")
  
  return (
    <>
      <Paper className={styles["paper"]}>
        Checkbox group
        <Divider/>
        <CheckboxRow
          fieldName="foo"
          label="Lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit amet cons"
          activeField={activeField}
          setActiveField={setActiveField}
        />
        <Divider/>
        <CheckboxRow
          fieldName="bar"
          label="Dolor sit amet"
          activeField={activeField}
          setActiveField={setActiveField}
        />
        <Divider/>
        Footer
      </Paper>
    </>
  )
}