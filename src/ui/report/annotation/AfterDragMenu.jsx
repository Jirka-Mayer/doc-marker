import { Menu, MenuList, MenuItem, ListItemIcon, Typography, ListSubheader, Divider, ListItemText } from "@mui/material";
import { useAtom } from "jotai";
import * as reportStore from "../../../state/reportStore"
import * as editorStore from "../../../state/editorStore"
import { createContextMenuAtoms } from "../utils/createContextMenuAtoms";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const quillExtended = reportStore.quillExtended

const {
  anchorTextRangeAtom,
  anchorPositionAtom,
  closeMenuAtom,
  openMenuAtom
} = createContextMenuAtoms()

export { openMenuAtom }

export function AfterDragMenu() {
  const { t } = useTranslation("annotationContextMenus")
  
  const [anchorTextRange] = useAtom(anchorTextRangeAtom)
  const [anchorPosition] = useAtom(anchorPositionAtom)
  const [,closeMenu] = useAtom(closeMenuAtom)
  
  const [activeFieldId] = useAtom(editorStore.activeFieldIdAtom)
  const [activeFieldHighlights] = useAtom(
    reportStore.getFieldHighlightsAtom(activeFieldId)
  )
  const alreadyHasHighlight = (activeFieldHighlights.length > 0)

  function addHighlight() {
    if (anchorTextRange === null || activeFieldId === null)
      return

    // highlight the text
    // and clear selection silently (to not trigger the click event)
    quillExtended.highlightText(
      anchorTextRange.index,
      anchorTextRange.length,
      activeFieldId
    )
    quillExtended.setSelection(anchorTextRange.index, 0, "silent")
    
    closeMenu()
  }

  function replaceHighlight() {
    if (anchorTextRange === null || activeFieldId === null)
      return
    
    // remove all existing highlights for this field ID
    quillExtended.highlightText(
      0,
      quillExtended.getLength(),
      activeFieldId,
      false
    )
    
    // add the new highlight
    addHighlight()
  }

  function handleKeydown(e) {
    if (anchorTextRange === null)
      return

    if (alreadyHasHighlight) {
      if (e.code === "KeyD" && e.shiftKey) {
        replaceHighlight()
        e.preventDefault()
      }
      if (e.code === "KeyD" && e.ctrlKey) {
        addHighlight()
        e.preventDefault()
      }
    } else {
      if (e.code === "KeyD") {
        replaceHighlight()
        e.preventDefault()
      }
    }
  }
  
  return (
    <>
      <Menu
        id="annotation-after-drag-context-menu"
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        open={anchorPosition !== null}
        onClose={closeMenu}
        onKeyDown={handleKeydown}
      >
        { alreadyHasHighlight ? (
          <MenuItem onClick={replaceHighlight}>
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText>
              { t("replaceHighlight") }
            </ListItemText>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              Shift + D
            </Typography>
          </MenuItem>
        ) : (
          <MenuItem onClick={replaceHighlight}>
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText>
              { t("createHighlight") }
            </ListItemText>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              D
            </Typography>
          </MenuItem>
        ) }

        { alreadyHasHighlight ? (
          <MenuItem onClick={addHighlight}>
            <ListItemIcon>
              <AddLocationIcon />
            </ListItemIcon>
            <ListItemText>
              { t("addHighlight") }
            </ListItemText>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              Ctrl + D
            </Typography>
          </MenuItem>
        ) : null }

        { alreadyHasHighlight ? (
          <Divider />
        ) : null }

        { alreadyHasHighlight ? (
          <Typography variant="body2" sx={{ px: 2 }}>
            { t("addMoreHighlightsExplainer", { count: activeFieldHighlights.length }) }
          </Typography>
        ) : null }

      </Menu>
    </>
  )
}