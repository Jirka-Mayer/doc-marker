import * as styles from "./AppBar.module.scss"
import {
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputBase
} from "@mui/material"
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
import { isFileOpenAtom, patientIdAtom } from "./appFileStore"
import { useState } from "react"
import { FileMenu } from "./menus/FileMenu"
import { ViewMenu } from "./menus/ViewMenu"
import { Toolbar } from "./Toolbar"

/*
  MENU CONTENTS
  -------------

  [File]
    - New empty
    - New from uploaded document (docx, odf, rtf, txt, pdf?)
    - Download
    - Details
        (file details - created at / modified at / UUID / Patient ID)
    - Language
    - Close file
  
  [Edit]
    - undo
    - redo

  [View]
    - compact app bar
    - debug info
    - show form

  [Format]
    - bold, italic, underline
    - ...
  
  [Tools]
    - pre-fill form

  [QuickActionBar]
    - undo / redo
    - bold, italic, underline
*/

const logoImageUrl = new URL(
  "resq-logo.png",
  import.meta.url
);

export function AppBar(props) {

  const {
    mode,
    setMode
  } = props

  const [isFileOpen] = useAtom(isFileOpenAtom)
  const [patientId] = useAtom(patientIdAtom)

  return (
    <Paper elevation={1} square className={styles["appbar"]}>

      <div className={styles["appbar__upper-container"]}>
        <div className={styles["appbar__logo"]}>
          <img src={logoImageUrl} alt="RES-Q+ Logo" />
        </div>
        <div className={styles["appbar__center"]}>
          <div className={styles["appbar__header"]}>
            { isFileOpen ? (
              <Typography
                sx={{ ml: 1 }}
                className={styles["appbar__patient-id"]}
                component="span"
                variant="button"
              >
                { patientId }
              </Typography>
            ) : (
              <Typography
                sx={{ ml: 1 }}
                className={styles["appbar__no-file-open"]}
                component="span"
                variant="body1"
              >
                No file open
              </Typography>
            ) }
          </div>
          <div className={styles["appbar__menubar"]}>
            <FileMenu />
            <Button size="small">Edit</Button>
            <ViewMenu />
            <Button size="small">Format</Button>
            <Button size="small">Tools</Button>
          </div>
        </div>
        <div className={styles["appbar__modeswitcher"]}>
          <ToggleButtonGroup
            color="primary"
            value={isFileOpen ? mode : null}
            disabled={!isFileOpen}
            exclusive
            onChange={(e, newMode) => {setMode(newMode)}}
          >
            <ToggleButton value={AppMode.EDIT_TEXT}>
              <ReadMoreIcon fontSize="small" sx={{ mr: 1 }} /> Edit text
            </ToggleButton>
            <ToggleButton value={AppMode.ANONYMIZE}>
              <ContentCutIcon fontSize="small" sx={{ mr: 1 }} /> Anonymize
            </ToggleButton>
            <ToggleButton value={AppMode.ANNOTATE_HIGHLIGHTS}>
              <LocationOnIcon fontSize="small" sx={{ mr: 1 }} /> Annotate
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>

      { isFileOpen ? <>
        <Divider />
        <div className={styles["appbar__toolbar"]}>
          <Toolbar />
        </div>
      </> : null }

    </Paper>
  )
}