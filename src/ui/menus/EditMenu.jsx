import { Button, Menu, MenuList, MenuItem, ListItemIcon, Typography, Divider } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai"
import * as fileStore from "../../state/fileStore"
import * as historyStore from "../../state/historyStore"
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

export function EditMenu() {
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

  const [canUndo] = useAtom(historyStore.canUndoAtom)
  const [canRedo] = useAtom(historyStore.canRedoAtom)
  const [,performUndo] = useAtom(historyStore.undoAtom)
  const [,performRedo] = useAtom(historyStore.redoAtom)

  // === click handlers ===

  function onUndoClick() {
    if (!isFileOpen) {
      return
    }
    performUndo()
    // closeMenu() // let's keep the menu open for repeated clicks
  }

  function onRedoClick() {
    if (!isFileOpen) {
      return
    }
    performRedo()
    // closeMenu() // let's keep the menu open for repeated clicks
  }

  // === keyboard shortcuts ===

  const handleKeydown = useCallback((e) => {
    if (e.key.toLowerCase() === "z" && e.ctrlKey && !e.shiftKey) {
      onUndoClick()
      e.preventDefault()
    }

    if (e.key.toLowerCase() === "z" && e.ctrlKey && e.shiftKey) {
      onRedoClick()
      e.preventDefault()
    }

    if (e.key.toLowerCase() === "y" && e.ctrlKey) {
      onRedoClick()
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
      >{ t("edit.headButton") }</Button>
      <Menu
        id="edit-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        variant="menu"
      >
        <MenuItem onClick={onUndoClick} disabled={!isFileOpen || !canUndo}>
          <ListItemIcon>
            <UndoIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("edit.undo") }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            Ctrl + Z
          </Typography>
        </MenuItem>

        <MenuItem onClick={onRedoClick} disabled={!isFileOpen || !canRedo}>
          <ListItemIcon>
            <RedoIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("edit.redo") }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            Ctrl + Y
          </Typography>
        </MenuItem>
      </Menu>
    </>
  )
}