import { Button, CircularProgress, Snackbar, Stack } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useContext } from "react";
import { DocMarkerContext } from "../DocMarkerContext";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";

export function RobotPredictionSnackbar() {
  // "menus" because the snackbar belongs to the menu item that fires it
  const { t } = useTranslation("menus");

  const { robotPredictor } = useContext(DocMarkerContext);

  const isPredictionRunning = useAtomValue(
    robotPredictor.isPredictionRunningAtom,
  );
  const attemptedFieldCount = useAtomValue(
    robotPredictor.attemptedFieldCountAtom
  );
  const finishedFieldCount = useAtomValue(
    robotPredictor.finishedFieldCountAtom
  );

  return (
    <Snackbar
      open={isPredictionRunning}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      message={
        <Stack direction="row" spacing={2}>
          <SmartToyIcon />
          <CircularProgress size="20px" />
          <strong>{ t("tools.robotPredictionSnackbar.message") }</strong>
          <span>{finishedFieldCount}/{attemptedFieldCount}</span>
        </Stack>
      }
      action={
        <Button size="small" onClick={() => robotPredictor.abortPrediction()}>
          { t("tools.robotPredictionSnackbar.abort") }
        </Button>
      }
    />
  );
}
