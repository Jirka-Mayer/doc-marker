import * as styles from "./AppBar.module.scss"
import { Button, ButtonGroup, Divider, IconButton, Menu, MenuItem, Paper, Typography } from "@mui/material"
import BorderColorIcon from "@mui/icons-material/BorderColor"
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ReadMoreIcon from '@mui/icons-material/ReadMore'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import DownloadIcon from '@mui/icons-material/Download'
import BugReportIcon from '@mui/icons-material/BugReport'
import { AppMode } from "./AppMode"
import { useAtom } from "jotai"
import { displayDebugInfoAtom } from "./userPreferencesStore"
import { useState } from "react"

export function AppBar(props) {

  const {
    closeFile,
    mode,
    setMode,
    patientId,
    downloadFile
  } = props

  const [displayDebugInfo, setDisplayDebugInfo] = useAtom(displayDebugInfoAtom)

  const [menuAnchorElement, setMenuAnchorElement] = useState(null)
  
  function onMenuClick(e) {
    setMenuAnchorElement(e.target)
  }

  return (
    <Paper elevation={1} square className={styles["appbar"]}>

      {/* <div style={{ background: "#1976d2", color: "white", padding: "2px 10px" }}>
        <Typography variant="button" component="p">
          Lorem ipsum
        </Typography>

        <ButtonGroup variant="contained" disableElevation style={{ background: "white" }}>
          <Button
            startIcon={<ReadMoreIcon />}
            variant={mode === AppMode.EDIT_TEXT ? "outlined" : "contained"}
            onClick={() => {setMode(AppMode.EDIT_TEXT)}}
            disableElevation
          >Enter Text</Button>
          <Button
            startIcon={<ContentCutIcon />}
            variant={mode === AppMode.ANONYMIZE ? "outlined" : "contained"}
            onClick={() => {setMode(AppMode.ANONYMIZE)}}
            disableElevation
          >Anonymize</Button>
          <Button
            startIcon={<LocationOnIcon />}
            variant={mode === AppMode.ANNOTATE_HIGHLIGHTS ? "outlined" : "contained"}
            onClick={() => {setMode(AppMode.ANNOTATE_HIGHLIGHTS)}}
            disableElevation
          >Annotate</Button>
        </ButtonGroup>
      </div> */}

      <div>
        
      </div>


      <div>
        <Button
          onClick={onMenuClick}
        >File</Button>
        <Button
          // onClick={handleClick}
        >View</Button>
      </div>

      <Menu
        anchorEl={menuAnchorElement}
        open={false}
        // onClose={handleClose}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>


      <div className={styles["appbar__upper"]}>
        <IconButton color="default" sx={{ p: '10px' }} onClick={() => closeFile()}>
          <ArrowBackIcon />
        </IconButton>
        Back to menu (close file)
        _______
        Patient ID: {patientId}
      </div>
      <Divider />
      <div className={styles["appbar__tools"]}>

        <IconButton
          color="default"
          sx={{ p: '10px' }}
          onClick={() => downloadFile()}
        >
          <DownloadIcon />
        </IconButton>

        <IconButton
          color={displayDebugInfo ? "primary" : "default"}
          sx={{ p: '10px' }}
          onClick={() => setDisplayDebugInfo(!displayDebugInfo)}
        >
          <BugReportIcon />
        </IconButton>

        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical"/>

        <ButtonGroup variant="outlined">
          <Button
            startIcon={<ReadMoreIcon />}
            variant={mode === AppMode.EDIT_TEXT ? "contained" : "outlined"}
            onClick={() => {setMode(AppMode.EDIT_TEXT)}}
            disableElevation
          >Enter Text</Button>
          <Button
            startIcon={<ContentCutIcon />}
            variant={mode === AppMode.ANONYMIZE ? "contained" : "outlined"}
            onClick={() => {setMode(AppMode.ANONYMIZE)}}
            disableElevation
          >Anonymize</Button>
          <Button
            startIcon={<LocationOnIcon />}
            variant={mode === AppMode.ANNOTATE_HIGHLIGHTS ? "contained" : "outlined"}
            onClick={() => {setMode(AppMode.ANNOTATE_HIGHLIGHTS)}}
            disableElevation
          >Annotate</Button>
        </ButtonGroup>

      </div>
    </Paper>
  )
}