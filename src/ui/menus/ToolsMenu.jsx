import { Button, Menu, MenuList, MenuItem, ListItemIcon, Typography, Divider } from "@mui/material";
import { useState } from "react";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useAtom } from "jotai"
import { fileStore } from "../../state";
import { runAutomaticExtraction } from "../../state";
import { useTranslation } from "react-i18next";
import { currentOptions } from "../../options";

export function ToolsMenu() {
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

  // === click handlers ===

  function onNlpExtractionClick() {
    runAutomaticExtraction()
    closeMenu()
  }

  return (
    <>
      <Button
        size="small"
        onClick={onMenuClick}
      >{ t("tools.headButton") }</Button>
      <Menu
        id="tools-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        variant="menu"
      >
        <MenuItem disabled={true} onClick={onNlpExtractionClick}> {/* TODO: temporarily disabled */}
          <ListItemIcon>
            <SmartToyIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("tools.fillOutAutomatically") }
          </Typography>
        </MenuItem>
        { currentOptions.slots.toolsMenu }
      </Menu>
    </>
  )
}