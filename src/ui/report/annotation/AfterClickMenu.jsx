import { Menu, MenuList, MenuItem, ListItemIcon, Typography, ListSubheader, Divider, ListItemText } from "@mui/material";
import { useAtom } from "jotai";
import { quillExtended, getFieldHighlightsAtom } from "../../../state/reportStore";
import { createContextMenuAtoms } from "../utils/createContextMenuAtoms";
import { activeFieldIdAtom } from "../../../state/editorStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import LocationOffIcon from '@mui/icons-material/LocationOff';

const {
  anchorTextRangeAtom,
  anchorPositionAtom,
  closeMenuAtom,
  openMenuAtom
} = createContextMenuAtoms()

export { openMenuAtom }

export function AfterClickMenu() {
  const { t } = useTranslation("annotationContextMenus")

  const [anchorTextRange] = useAtom(anchorTextRangeAtom)
  const [anchorPosition] = useAtom(anchorPositionAtom)
  const [,closeMenu] = useAtom(closeMenuAtom)
  
  const [activeFieldId] = useAtom(activeFieldIdAtom)
  const [activeFieldHighlights] = useAtom(
    getFieldHighlightsAtom(activeFieldId)
  )
  const hasMultipleHighlights = (activeFieldHighlights.length >= 2)

  function removeHighlightMarking() {
    if (anchorTextRange === null || activeFieldId === null)
      return
    
    quillExtended.highlightText(
      anchorTextRange.index,
      anchorTextRange.length,
      activeFieldId,
      false
    )
    
    closeMenu()
  }

  function removeAllHighlightMarkings() {
    if (anchorTextRange === null || activeFieldId === null)
      return
    
    quillExtended.highlightText(
      0,
      quillExtended.getLength(),
      activeFieldId,
      false
    )
    
    closeMenu()
  }

  useEffect(() => {
    function handleKeydown(e) {
      if (anchorTextRange === null)
        return

      if (e.code === "Space" && !e.ctrlKey) {
        removeHighlightMarking()
        return true
      }
      if (e.code === "Space" && e.ctrlKey) {
        removeAllHighlightMarkings()
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

          <MenuItem onClick={removeHighlightMarking}>
            <ListItemIcon>
              <WrongLocationIcon />
            </ListItemIcon>
            <ListItemText>
              { t("removePairing") }
            </ListItemText>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              { t("shortcut.space") }
            </Typography>
          </MenuItem>

          { hasMultipleHighlights ? (
            <MenuItem onClick={removeAllHighlightMarkings}>
              <ListItemIcon>
                <LocationOffIcon />
              </ListItemIcon>
              <ListItemText>
                { t("removeAllPairings") }
              </ListItemText>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              { t("shortcut.ctrlSpace") }
              </Typography>
            </MenuItem>
          ) : null }

          { hasMultipleHighlights ? (
            <Divider />
          ) : null }

          { hasMultipleHighlights ? (
            <Typography variant="body2" sx={{ px: 2, pt: 1 }}>
              { t("removeAllPairingsExplainer", { count: activeFieldHighlights.length - 1 }) }
            </Typography>
          ) : null }

        </MenuList>
      </Menu>
    </>
  )
}