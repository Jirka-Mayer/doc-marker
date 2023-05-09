import { Button, Menu, MenuList, MenuItem, ListItemIcon, Typography, Divider } from "@mui/material";
import { useState } from "react";
import BugReportIcon from '@mui/icons-material/BugReport'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ReadMoreIcon from '@mui/icons-material/ReadMore'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import { useAtom } from "jotai"
import { displayDebugInfoAtom } from "../../state/userPreferencesStore";
import { appModeAtom } from "../../state/editorStore";
import { AppMode } from "../../state/editor/AppMode";
import { isFileOpenAtom } from "../../state/fileStore";

export function ViewMenu() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  function onMenuClick(e) {
    setAnchorEl(e.target)
  }
  function closeMenu() {
    setAnchorEl(null)
  }

  // === used state ===

  const [isFileOpen] = useAtom(isFileOpenAtom)
  const [appMode, setAppMode] = useAtom(appModeAtom)
  const [displayDebugInfo, setDisplayDebugInfo] = useAtom(displayDebugInfoAtom)

  // === click handlers ===

  function onDisplayDebugInfoClick() {
    setDisplayDebugInfo(!displayDebugInfo)
    closeMenu()
  }

  return (
    <>
      <Button
        size="small"
        onClick={onMenuClick}
      >View</Button>
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
          <Typography variant="inherit">Text editing mode</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => setAppMode(AppMode.ANONYMIZE)}
          selected={appMode === AppMode.ANONYMIZE}
          disabled={!isFileOpen}
        >
          <ListItemIcon>
            <ContentCutIcon />
          </ListItemIcon>
          <Typography variant="inherit">Anonymization mode</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => setAppMode(AppMode.ANNOTATE_HIGHLIGHTS)}
          selected={appMode === AppMode.ANNOTATE_HIGHLIGHTS}
          disabled={!isFileOpen}
        >
          <ListItemIcon>
            <LocationOnIcon />
          </ListItemIcon>
          <Typography variant="inherit">Annotation mode</Typography>
        </MenuItem>
        
        <Divider />

        <MenuItem selected={displayDebugInfo} onClick={onDisplayDebugInfoClick}>
          <ListItemIcon>
            <BugReportIcon />
          </ListItemIcon>
          <Typography variant="inherit">Display debug info</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}