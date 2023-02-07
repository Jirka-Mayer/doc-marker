import { Button, Menu, MenuList, MenuItem, ListItemIcon, Typography, Divider } from "@mui/material";
import { useState } from "react";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useAtom } from "jotai"
import { isFileOpenAtom } from "../../state/fileStore";

export function ToolsMenu() {
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

  // === click handlers ===

  function onExportToResqClick() {
    //
    closeMenu()
  }

  function onNlpExtractionClick() {
    //
    closeMenu()
  }

  return (
    <>
      <Button
        size="small"
        onClick={onMenuClick}
      >Tools</Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
      >
        <MenuList>
          <MenuItem disabled={!isFileOpen} onClick={onNlpExtractionClick}>
            <ListItemIcon>
              <SmartToyIcon />
            </ListItemIcon>
            <Typography variant="inherit">Fill out form automatically</Typography>
          </MenuItem>
          <MenuItem disabled={!isFileOpen} onClick={onExportToResqClick}>
            <ListItemIcon>
              <LocalShippingIcon />
            </ListItemIcon>
            <Typography variant="inherit">Export to RES-Q registry</Typography>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}