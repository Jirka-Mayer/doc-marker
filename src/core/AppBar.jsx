import * as styles from "./AppBar.module.scss"
import { Button, ButtonGroup, Divider, IconButton, Paper } from "@mui/material"
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

export function AppBar(props) {

  const {
    closeFile,
    mode,
    setMode,
    patientId,
    downloadFile
  } = props

  const [displayDebugInfo, setDisplayDebugInfo] = useAtom(displayDebugInfoAtom)

  return (
    <Paper elevation={1} square className={styles["appbar"]}>
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