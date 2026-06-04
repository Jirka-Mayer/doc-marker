import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
} from "@mui/material";
import { useContext, useState } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { DocMarkerContext } from "../DocMarkerContext";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import SmartButtonIcon from "@mui/icons-material/SmartButton";
import { AppMode } from "../../state/AppMode";

export function ToolsMenu() {
  const { t } = useTranslation("menus");

  const {
    dmOptions,
    fileMetadataStore,
    robotPredictor,
    robotPredictionStore,
    fieldsRepository,
    quillExtended,
    editorStore,
  } = useContext(DocMarkerContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  function onMenuClick(e) {
    setAnchorEl(e.target);
  }
  function closeMenu() {
    setAnchorEl(null);
  }

  // === used state ===

  const isFileOpen = useAtomValue(fileMetadataStore.isFileOpenAtom);
  const isRobotPredictionRunning = useAtomValue(
    robotPredictor.isPredictionRunningAtom,
  );
  const activeFieldId = useAtomValue(editorStore.activeFieldIdAtom);
  const appMode = useAtomValue(editorStore.appModeAtom);

  // === click handlers ===

  function handleRobotPredictionClick() {
    // TODO: check the report has a language set
    alert("TODO: check that the report has a language set");

    robotPredictor.startPrediction();
    closeMenu();
  }

  function predictActiveField() {
    // TODO: check the report has a language set
    alert("TODO: check that the report has a language set");
    if (activeFieldId === null) {
      return;
    }
    robotPredictor.startPrediction([activeFieldId]);
    closeMenu();
  }

  function eraseRobotDataForField() {
    if (activeFieldId === null) {
      return;
    }
    robotPredictionStore.eraseRobotPrediction(activeFieldId);
    closeMenu();
  }

  function eraseAllFormData() {
    fieldsRepository.eraseAllFieldValues();
    quillExtended.removeAllHighlights();
    robotPredictionStore.eraseAllPredictionData();
    closeMenu();
  }

  return (
    <>
      <Button size="small" onClick={onMenuClick}>
        {t("tools.headButton")}
      </Button>
      <Menu
        id="tools-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        variant="menu"
      >
        <MenuItem
          onClick={handleRobotPredictionClick}
          disabled={
            appMode !== AppMode.ANNOTATE_HIGHLIGHTS ||
            isRobotPredictionRunning ||
            !isFileOpen ||
            !robotPredictor.isRobotAvailable
          }
        >
          <ListItemIcon>
            <SmartToyIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            {t("tools.fillOutAutomatically")}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={predictActiveField}
          disabled={
            appMode !== AppMode.ANNOTATE_HIGHLIGHTS ||
            isRobotPredictionRunning ||
            !isFileOpen ||
            !activeFieldId ||
            !robotPredictor.isRobotAvailable
          }
        >
          <ListItemIcon>
            <SmartButtonIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            {t("tools.predictActiveField")}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={eraseRobotDataForField}
          disabled={
            appMode !== AppMode.ANNOTATE_HIGHLIGHTS ||
            !isFileOpen ||
            !activeFieldId
          }
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            {t("tools.eraseRobotDataForField")}
          </Typography>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={eraseAllFormData}
          disabled={appMode !== AppMode.ANNOTATE_HIGHLIGHTS || !isFileOpen}
        >
          <ListItemIcon>
            <DeleteSweepIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            {t("tools.eraseAllFormData")}
          </Typography>
        </MenuItem>

        {dmOptions.slots.toolsMenu}
      </Menu>
    </>
  );
}
