import {
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
  ListItemText,
} from "@mui/material";
import { useAtomValue } from "jotai";
import * as editorStore from "../../../state/editorStore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { DocMarkerContext } from "../../DocMarkerContext";
import { ContextMenuController } from "../ContextMenuController";

export function AfterDragMenu(props: { cmc: ContextMenuController }) {
  const { cmc } = props;
  const { quillExtended, reportStore } = useContext(DocMarkerContext);
  const { t } = useTranslation("annotationContextMenus");

  const anchorTextRange = useAtomValue(cmc.anchorTextRangeAtom);
  const anchorPosition = useAtomValue(cmc.anchorPositionAtom);

  const activeFieldId = useAtomValue(editorStore.activeFieldIdAtom);
  const activeFieldHighlights = useAtomValue(
    reportStore.getFieldHighlightsAtom(activeFieldId),
  );
  const alreadyHasHighlight = activeFieldHighlights.length > 0;

  function addHighlight() {
    if (anchorTextRange === null || activeFieldId === null) return;

    // highlight the text
    // and clear selection silently (to not trigger the click event)
    quillExtended.highlightText(
      anchorTextRange.index,
      anchorTextRange.length,
      activeFieldId,
    );
    quillExtended.setSelection(anchorTextRange.index, 0, "silent");

    cmc.closeMenu();
  }

  function replaceHighlight() {
    if (anchorTextRange === null || activeFieldId === null) return;

    // remove all existing highlights for this field ID
    quillExtended.highlightText(
      0,
      quillExtended.getLength(),
      activeFieldId,
      false,
    );

    // add the new highlight
    addHighlight();
  }

  function handleKeydown(e) {
    if (anchorTextRange === null) return;

    if (alreadyHasHighlight) {
      if (e.code === "KeyD" && e.shiftKey) {
        replaceHighlight();
        e.preventDefault();
      }
      if (e.code === "KeyD" && e.ctrlKey) {
        addHighlight();
        e.preventDefault();
      }
    } else {
      if (e.code === "KeyD") {
        replaceHighlight();
        e.preventDefault();
      }
    }
  }

  return (
    <>
      <Menu
        id="annotation-after-drag-context-menu"
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition || undefined}
        open={anchorPosition !== null}
        onClose={() => cmc.closeMenu()}
        onKeyDown={handleKeydown}
      >
        {alreadyHasHighlight ? (
          <MenuItem onClick={replaceHighlight}>
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText>{t("replaceHighlight")}</ListItemText>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              Shift + D
            </Typography>
          </MenuItem>
        ) : (
          <MenuItem onClick={replaceHighlight}>
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText>{t("createHighlight")}</ListItemText>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              D
            </Typography>
          </MenuItem>
        )}

        {alreadyHasHighlight ? (
          <MenuItem onClick={addHighlight}>
            <ListItemIcon>
              <AddLocationIcon />
            </ListItemIcon>
            <ListItemText>{t("addHighlight")}</ListItemText>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              Ctrl + D
            </Typography>
          </MenuItem>
        ) : null}

        {alreadyHasHighlight ? <Divider /> : null}

        {alreadyHasHighlight ? (
          <Typography variant="body2" sx={{ px: 2 }}>
            {t("addMoreHighlightsExplainer", {
              count: activeFieldHighlights.length,
            })}
          </Typography>
        ) : null}
      </Menu>
    </>
  );
}
