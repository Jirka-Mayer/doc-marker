import * as styles from "./AppBar.module.scss"
import {
  Button,
  Divider,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  InputBase,
} from "@mui/material"
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ReadMoreIcon from '@mui/icons-material/ReadMore'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import { AppMode } from "../state/editor/AppMode"
import { useAtom } from "jotai"
import * as fileStore from "../state/fileStore"
import { FileMenu } from "./menus/FileMenu"
import { EditMenu } from "./menus/EditMenu"
import { ViewMenu } from "./menus/ViewMenu"
import { Toolbar } from "./Toolbar"
import { ToolsMenu } from "./menus/ToolsMenu"
import { appModeAtom } from "../state/editorStore"
import { useTranslation } from "react-i18next";
import { useState } from "react"
import { AppFile } from "../state/file/AppFile"

const logoImageUrl = new URL(
  "resq-logo.png",
  import.meta.url
);

export function AppBar() {
  const { t } = useTranslation("appbar")

  const [isFileOpen] = useAtom(fileStore.isFileOpenAtom)
  const [appMode, setAppMode] = useAtom(appModeAtom)
  const [fileName, setFileName] = useAtom(fileStore.fileNameAtom)
  const [fileUuid] = useAtom(fileStore.fileUuidAtom)

  return (
    <Paper elevation={1} square className={styles["appbar"]}>

      <div className={styles["appbar__upper-container"]}>
        <div
          className={styles["appbar__logo"]}
          onClick={() => fileStore.closeFile()}
          style={{ cursor: isFileOpen ? "pointer" : "default" }}
        >
          <img src={logoImageUrl} alt="RES-Q+ Logo" />
        </div>
        <div className={styles["appbar__center"]}>
          <div className={styles["appbar__header"]}>
            { isFileOpen ? (
              <InputBase
                className={styles["appbar__file-name"]}
                value={ fileName }
                onChange={(e) => { setFileName(e.target.value) }}
                placeholder={ AppFile.constructUuidFileName(fileUuid) }
              />
            ) : (
              <Typography
                sx={{ ml: 1 }}
                className={styles["appbar__no-file-open"]}
                component="span"
                variant="body1"
              >
                { t("noFileOpen") }
              </Typography>
            ) }
          </div>
          <div className={styles["appbar__menubar"]}>
            <FileMenu />
            <EditMenu />
            <ViewMenu />
            <Button disabled={true} size="small">
            { t("menus:format.headButton") }
            </Button>
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
              <ReadMoreIcon fontSize="small" sx={{ mr: 1 }} />
              { t("mode.edit") }
            </ToggleButton>
            <ToggleButton value={AppMode.ANONYMIZE}>
              <ContentCutIcon fontSize="small" sx={{ mr: 1 }} />
              { t("mode.anonymize") }
            </ToggleButton>
            <ToggleButton value={AppMode.ANNOTATE_HIGHLIGHTS}>
              <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
              { t("mode.annotate") }
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>

      {/* Keep the toolbar closed for now */}
      {/* { isFileOpen ? <>
        <Divider />
        <div className={styles["appbar__toolbar"]}>
          <Toolbar />
        </div>
      </> : null } */}

    </Paper>
  )
}