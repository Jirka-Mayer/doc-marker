import { Button, Menu, MenuList, MenuItem, ListItemIcon, Typography, Divider } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import BugReportIcon from '@mui/icons-material/BugReport'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ReadMoreIcon from '@mui/icons-material/ReadMore'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import { useAtom } from "jotai"
import { AppMode, editorStore, userPreferencesStore, fileStore } from "../../state";
import { useTranslation } from "react-i18next";

export function ViewMenu() {
  const { t } = useTranslation("menus")

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  function onMenuClick(e) {
    setAnchorEl(e.target)
  }
  function closeMenu() {
    setAnchorEl(null)
  }

  // === used state ===

  const [isFileOpen] = useAtom(fileStore.isFileOpenAtom)
  const [appMode, setAppMode] = useAtom(editorStore.appModeAtom)
  const [displayDebugInfo, setDisplayDebugInfo] = useAtom(
    userPreferencesStore.displayDebugInfoAtom
  )

  // === click handlers ===

  function onDisplayDebugInfoClick() {
    setDisplayDebugInfo(!displayDebugInfo)
    closeMenu()
  }

  // === keyboard shortcuts ===

  const handleKeydown = useCallback((e) => {
    if (e.key.toLowerCase() === "f12" && e.ctrlKey) {
      onDisplayDebugInfoClick()
      e.preventDefault()
    }
  })

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown)
    return () => {
      document.removeEventListener("keydown", handleKeydown)
    }
  })

  // === rendering ===

  return (
    <>
      <Button
        size="small"
        onClick={onMenuClick}
      >{ t("view.headButton") }</Button>
      <Menu
        id="view-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        variant="menu"
      >
        <MenuItem
          onClick={() => setAppMode(AppMode.EDIT_TEXT)}
          selected={appMode === AppMode.EDIT_TEXT}
          disabled={!isFileOpen}
        >
          <ListItemIcon>
            <ReadMoreIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("view.textEditingMode") }
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => setAppMode(AppMode.ANONYMIZE)}
          selected={appMode === AppMode.ANONYMIZE}
          disabled={!isFileOpen}
        >
          <ListItemIcon>
            <ContentCutIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("view.anonymizationMode") }
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => setAppMode(AppMode.ANNOTATE_HIGHLIGHTS)}
          selected={appMode === AppMode.ANNOTATE_HIGHLIGHTS}
          disabled={!isFileOpen}
        >
          <ListItemIcon>
            <LocationOnIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("view.annotationMode") }
          </Typography>
        </MenuItem>
        
        <Divider />

        <MenuItem selected={displayDebugInfo} onClick={onDisplayDebugInfoClick}>
          <ListItemIcon>
            <BugReportIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("view.displayDebugInfo") }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            Ctrl + F12
          </Typography>
        </MenuItem>
      </Menu>
    </>
  )
}