import { Menu, MenuList, MenuItem, ListItemIcon, Typography, ListSubheader, Divider, ListItemText } from "@mui/material";
import { useAtom } from "jotai";
import { quillExtended, getFieldHighlightsAtom } from "../../../state/reportStore";
import { createContextMenuAtoms } from "../utils/createContextMenuAtoms";
import { activeFieldIdAtom } from "../../../state/editorStore";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

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
  
  const [activeFieldId] = useAtom(activeFieldIdAtom)
  const [activeFieldHighlights] = useAtom(
    getFieldHighlightsAtom(activeFieldId)
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

  useEffect(() => {
    function handleKeydown(e) {
      if (anchorTextRange === null)
        return

      if (e.code === "Space" && !e.ctrlKey) {
        replaceHighlight()
        return true
      }
      if (e.code === "Space" && e.ctrlKey) {
        addHighlight()
        return true
      }
    }

    document.addEventListener("keydown", handleKeydown)
    return () => {
      document.removeEventListener("keydown", handleKeydown)
    }
  })
  
  return (
    <>
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        open={anchorPosition !== null}
        onClose={closeMenu}
      >
        <MenuList>

          <MenuItem onClick={replaceHighlight}>
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText>
              {
                alreadyHasHighlight
                  ? t("replacePairing")
                  : t("createPairing")
              }
            </ListItemText>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              { t("shortcut.space") }
            </Typography>
          </MenuItem>

          { alreadyHasHighlight ? (
            <MenuItem onClick={addHighlight}>
              <ListItemIcon>
                <AddLocationIcon />
              </ListItemIcon>
              <ListItemText>
                { t("addPairing") }
              </ListItemText>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              { t("shortcut.ctrlSpace") }
              </Typography>
            </MenuItem>
          ) : null }

          { alreadyHasHighlight ? (
            <Divider />
          ) : null }

          { alreadyHasHighlight ? (
            <Typography variant="body2" sx={{ px: 2, pt: 1 }}>
              { t("addMorePairingsExplainer", { count: activeFieldHighlights.length }) }
            </Typography>
          ) : null }

        </MenuList>
      </Menu>
    </>
  )
}