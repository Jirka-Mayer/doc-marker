import { Button, Menu, MenuList, MenuItem, ListItemIcon, Typography, Divider } from "@mui/material";
import { useState, useCallback, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai"
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import * as editorStore from "../../state/editorStore";
import * as reportStore from "../../state/reportStore";
import { DocMarkerContext } from "../DocMarkerContext";
import { AppMode } from "../../state/editor/AppMode";

export function FormatMenu() {
  const { t } = useTranslation("menus")

  const { fileMetadataStore } = useContext(DocMarkerContext);

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  function onMenuClick(e) {
    setAnchorEl(e.target)
  }
  function closeMenu() {
    setAnchorEl(null)
  }

  // === used state ===

  const [isFileOpen] = useAtom(fileMetadataStore.isFileOpenAtom)
  const [appMode] = useAtom(editorStore.appModeAtom)

  const [selectionFormats] = useAtom(reportStore.selectionFormatsAtom)

  function toggleSelectionFormat(name, value = true) {
    if (selectionFormats[name] !== value)
      reportStore.quillExtended.format(name, value)
    else
      reportStore.quillExtended.format(name, false)
  }

  // === click handlers ===

  function onFormatClick(format, value = true) {
    if (!isFileOpen) {
      return
    }
    toggleSelectionFormat(format, value)
    // closeMenu() // keep it open for multiple actions
  }

  function onClearFormatClick() {
    if (!isFileOpen) {
      return
    }
    reportStore.quillExtended.removeFormat()
    closeMenu()
  }

  // === keyboard shortcuts ===

  const handleKeydown = useCallback((e) => {
    if (e.key.toLowerCase() === "b" && e.ctrlKey) {
      onFormatClick("bold")
      e.preventDefault()
    }
    if (e.key.toLowerCase() === "i" && e.ctrlKey) {
      onFormatClick("italic")
      e.preventDefault()
    }
    if (e.key.toLowerCase() === "u" && e.ctrlKey) {
      onFormatClick("underline")
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

  const formattingDisabled = !isFileOpen || appMode !== AppMode.EDIT_TEXT

  return (
    <>
      <Button
        size="small"
        onClick={onMenuClick}
      >{ t("format.headButton") }</Button>
      <Menu
        id="format-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        variant="menu"
      >
        <MenuItem
          onClick={() => onFormatClick("bold")}
          selected={selectionFormats["bold"]}
          disabled={formattingDisabled}
        >
          <ListItemIcon>
            <FormatBoldIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("format.bold") }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            Ctrl + B
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={() => onFormatClick("italic")}
          selected={selectionFormats["italic"]}
          disabled={formattingDisabled}
        >
          <ListItemIcon>
            <FormatItalicIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("format.italic") }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            Ctrl + I
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={() => onFormatClick("underline")}
          selected={selectionFormats["underline"]}
          disabled={formattingDisabled}
        >
          <ListItemIcon>
            <FormatUnderlinedIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("format.underline") }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            Ctrl + U
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={() => onFormatClick("strike")}
          selected={selectionFormats["strike"]}
          disabled={formattingDisabled}
        >
          <ListItemIcon>
            <FormatStrikethroughIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("format.strikethrough") }
          </Typography>
        </MenuItem>

        <Divider />

        {[1, 2, 3, 4, 5, 6].map(i =>
          <MenuItem
            onClick={() => onFormatClick("header", i)}
            selected={selectionFormats["header"] === i}
            disabled={formattingDisabled}
            key={i}
          >
            <ListItemIcon>
              <FormatSizeIcon />
            </ListItemIcon>
            <Typography variant="inherit">
              { t("format.header") + " " + i }
            </Typography>
          </MenuItem>
        )}

        <Divider />

        <MenuItem onClick={onClearFormatClick} disabled={formattingDisabled}>
          <ListItemIcon>
            <FormatClearIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            { t("format.clearFormat") }
          </Typography>
        </MenuItem>
      </Menu>
    </>
  )
}