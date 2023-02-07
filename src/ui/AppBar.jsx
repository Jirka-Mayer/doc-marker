import * as styles from "./AppBar.module.scss"
import {
  Button,
  Divider,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material"
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ReadMoreIcon from '@mui/icons-material/ReadMore'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import { AppMode } from "../state/editor/AppMode"
import { useAtom } from "jotai"
import { isFileOpenAtom, patientIdAtom } from "../state/fileStore"
import { FileMenu } from "./menus/FileMenu"
import { ViewMenu } from "./menus/ViewMenu"
import { Toolbar } from "./Toolbar"
import { ToolsMenu } from "./menus/ToolsMenu"
import { appModeAtom } from "../state/editorStore"

const logoImageUrl = new URL(
  "resq-logo.png",
  import.meta.url
);

export function AppBar() {
  const [isFileOpen] = useAtom(isFileOpenAtom)
  const [appMode, setAppMode] = useAtom(appModeAtom)
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
            <Button disabled={true} size="small">Edit</Button>
            <ViewMenu />
            <Button disabled={true} size="small">Format</Button>
            <ToolsMenu />
          </div>
        </div>
        <div className={styles["appbar__modeswitcher"]}>
          <ToggleButtonGroup
            color="primary"
            value={isFileOpen ? appMode : null}
            disabled={!isFileOpen}
            exclusive
            onChange={(e, newMode) => {setAppMode(newMode)}}
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