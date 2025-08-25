import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { currentOptions } from "../../options";
import { DocMarkerContext } from "../DocMarkerContext";

export function ToolsMenu() {
  const { t } = useTranslation("menus");

  const { fileMetadataStore, robotPredictor } = useContext(DocMarkerContext);

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

  // === click handlers ===

  function handleRobotPredictionClick() {
    robotPredictor.startPrediction();
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
          disabled={isRobotPredictionRunning}
        >
          <ListItemIcon>
            <SmartToyIcon />
          </ListItemIcon>
          <Typography variant="inherit">
            {t("tools.fillOutAutomatically")}
          </Typography>
        </MenuItem>
        {currentOptions.slots.toolsMenu}
      </Menu>
    </>
  );
}
