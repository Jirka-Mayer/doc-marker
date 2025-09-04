import { IconButton, Tooltip } from "@mui/material";
import { FieldPrediction } from "../../state/form/RobotPredictionStore";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useContext } from "react";
import { DocMarkerContext } from "../DocMarkerContext";
import { TranslateProps } from "@jsonforms/react";
import { Translator } from "@jsonforms/core";

export interface RobotButtonsProps extends TranslateProps {
  readonly fieldId: string;
  readonly fieldPrediction: FieldPrediction;
  readonly t: Translator;
}

export function RobotButtons({
  fieldId,
  fieldPrediction,
  t,
}: RobotButtonsProps) {
  const { robotPredictionStore } = useContext(DocMarkerContext);

  const robotTooltip = t("robotButtons.robot");
  const verifyTooltip = t("robotButtons.verify");
  const unverifyTooltip = t("robotButtons.unverify");

  const { isHumanVerified, robot } = fieldPrediction;

  function onRobotIconClicked() {
    alert(JSON.stringify(fieldPrediction, null, 2));
  }

  function onVerificationIconClicked() {
    robotPredictionStore.toggleIsHumanVerified(fieldId);
  }

  const ThumbIcon = isHumanVerified ? ThumbUpIcon : ThumbUpOffAltIcon;
  return (
    <>
      {robot !== null && (
        <Tooltip title={robotTooltip} disableInteractive>
          <IconButton
            onClick={onRobotIconClicked}
            sx={{ p: "10px", opacity: isHumanVerified === null ? 0.5 : 1.0 }}
            tabIndex={-1}
          >
            <SmartToyIcon />
          </IconButton>
        </Tooltip>
      )}
      {isHumanVerified !== null && (
        <Tooltip
          title={isHumanVerified ? unverifyTooltip : verifyTooltip}
          disableInteractive
        >
          <IconButton
            onClick={onVerificationIconClicked}
            sx={{ p: "10px" }}
            tabIndex={-1}
            color={isHumanVerified ? undefined : "primary"}
          >
            <ThumbIcon sx={{ position: "relative", top: 3, left: 3 }} />
            <SmartToyIcon
              sx={{ position: "absolute", top: 7, left: 7, fontSize: "14px" }}
            />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}
