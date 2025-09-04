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
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { currentOptions } from "../../options";
import { DocMarkerContext } from "../DocMarkerContext";
import { activeFieldIdAtom } from "../../state/editor/fieldActivityStore";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { highlightsAtom } from "../../state/report/highlightsStore";
import SmartButtonIcon from "@mui/icons-material/SmartButton";

export function ToolsMenu() {
  const { t } = useTranslation("menus");

  const {
    fileMetadataStore,
    robotPredictor,
    robotPredictionStore,
    fieldsRepository,
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

  const [isFileOpen] = useAtom(fileMetadataStore.isFileOpenAtom);
  const isRobotPredictionRunning = useAtomValue(
    robotPredictor.isPredictionRunningAtom,
  );
  const activeFieldId = useAtomValue(activeFieldIdAtom);
  const setHighlights = useSetAtom(highlightsAtom);

  // === click handlers ===

  function handleRobotPredictionClick() {
    robotPredictor.startPrediction();
    closeMenu();
  }

  function predictActiveField() {
    robotPredictor.startPrediction([activeFieldId]);
    closeMenu();
  }

  function eraseRobotDataForField() {
    robotPredictionStore.eraseRobotPrediction(activeFieldId);
    closeMenu();
  }

  function eraseAllFormData() {
    fieldsRepository.eraseAllFieldValues();
    setHighlights({}); // TODO: this does not work!
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
          disabled={isRobotPredictionRunning || !isFileOpen}
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
          disabled={isRobotPredictionRunning || !isFileOpen || !activeFieldId}
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
          disabled={!isFileOpen || !activeFieldId}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            {t("tools.eraseRobotDataForField")}
          </Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={eraseAllFormData} disabled={!isFileOpen}>
          <ListItemIcon>
            <DeleteSweepIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            {t("tools.eraseAllFormData")}
          </Typography>
        </MenuItem>

        {currentOptions.slots.toolsMenu}
      </Menu>
    </>
  );
}
