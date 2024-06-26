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
import SyncIcon from '@mui/icons-material/Sync'
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone'
import { AppMode, AppFile, fileStore, editorStore, autosaveStore } from "../state"
import { useAtom } from "jotai"
import { FileMenu } from "./menus/FileMenu"
import { EditMenu } from "./menus/EditMenu"
import { ViewMenu } from "./menus/ViewMenu"
import { Toolbar } from "./Toolbar"
import { ToolsMenu } from "./menus/ToolsMenu"
import { useTranslation } from "react-i18next";
import { useState } from "react"
import { currentOptions } from "../options"
import { FormatMenu } from "./menus/FormatMenu"

export function AppBar() {
  const { t } = useTranslation("appbar")

  const [isFileOpen] = useAtom(fileStore.isFileOpenAtom)
  const [appMode, setAppMode] = useAtom(editorStore.appModeAtom)
  const [fileName, setFileName] = useAtom(fileStore.fileNameAtom)
  const [fileUuid] = useAtom(fileStore.fileUuidAtom)
  const [isFileDirty] = useAtom(autosaveStore.isDirtyAtom)

  return (
    <Paper elevation={1} square className={styles["appbar"]}>

      <div className={styles["appbar__upper-container"]}>
        <div
          className={styles["appbar__logo"]}
          onClick={() => fileStore.closeFile()}
          style={{ cursor: isFileOpen ? "pointer" : "default" }}
        >
          <img
            src={currentOptions.customization.appBarLogoUrl}
            alt="Application Logo"
          />
        </div>
        <div className={styles["appbar__center"]}>
          <div className={styles["appbar__header"]}>
            { isFileOpen ? <>
              <div className={styles["appbar__file-name"]}>
                <div className={styles["appbar__file-name-width-driver"]}>
                  { AppFile.constructFileName(fileName, fileUuid) }
                </div>
                <InputBase
                  className={styles["appbar__file-name-field"]}
                  value={ fileName }
                  onChange={(e) => {
                    setFileName(e.target.value)
                    autosaveStore.setDirty()
                  }}
                  placeholder={ AppFile.constructUuidFileName(fileUuid) }
                />
              </div>

              <Typography
                sx={{ ml: 1, mb: 0.5 }}
                className={styles["appbar__autosave-text"]}
                component="span"
                variant="body2"
              >
                { isFileDirty ? <>
                  <SyncIcon fontSize="small" sx={{ mr: 1 }}/>
                  { t("saving") }
                </> : <>
                  <FileDownloadDoneIcon fontSize="small" sx={{ mr: 1 }}/>
                  { t("saved") }
                </> }
              </Typography>
            </> : (
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
            <FormatMenu />
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

      { (isFileOpen && appMode === AppMode.EDIT_TEXT) ? <>
        <Divider />
        <div className={styles["appbar__toolbar"]}>
          <Toolbar />
        </div>
      </> : null }

    </Paper>
  )
}