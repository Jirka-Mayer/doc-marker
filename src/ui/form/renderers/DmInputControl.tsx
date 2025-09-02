import * as styles from "./renderers.module.scss";
import {
  FormHelperText,
  InputLabel,
  Divider,
  Paper,
  ToggleButton,
  InputBase,
  Tooltip,
  alpha,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CheckIcon from "@mui/icons-material/Check";
import { useFieldActivity } from "../useFieldActivity";
import HideSourceIcon from "@mui/icons-material/HideSource";
import { useCallback, useContext, useMemo } from "react";
import { useNullabilityMiddleware } from "../useNullabilityMiddleware";
import { formStore, userPreferencesStore } from "../../../state";
import { useHighlightPinButton } from "../useHighlightPinButton";
import { useTheme } from "@emotion/react";
import { useAtom } from "jotai";
import { DocMarkerContext } from "../../DocMarkerContext";
import { ControlProps } from "@jsonforms/core";
import { WithInput } from "@jsonforms/material-renderers";
import { TranslateProps } from "@jsonforms/react";
import { NullabilityProps } from "./NullabilityProps";
import { CoercionProps } from "./CoercionProps";

/**
 * Wrapper for all input controls that have the "label : field : errors" structure
 * where the field is a text/integer/select input (any one-line input).
 * The control "input" element is passed as a prop "controlInput"
 * and inside used as "InnerComponent"
 */
export function DmInputControl(
  props: ControlProps &
    TranslateProps &
    WithInput &
    NullabilityProps &
    CoercionProps,
) {
  const {
    data,
    label,
    errors,
    id,
    schema,
    uischema,
    visible,
    path,
    t,
    ignoreNullability,
    handleChange,
    input: InnerComponent,
    inputCoercionFunction,
  } = props;

  const fieldId: string = path; // field ID is defined to be the path in the form data
  const htmlId: string = id + "-input";

  // get access to the global context
  const { fieldsRepository, robotPredictionStore } =
    useContext(DocMarkerContext);

  // === field activity ===

  const { isFieldActive, toggleFieldActivity, setFieldActive } =
    useFieldActivity(fieldId);

  // === field highlights ===

  const { HighlightPinButton } = useHighlightPinButton({
    ...props,
    fieldId,
  });

  // === nullability ===

  const isNullable =
    ignoreNullability !== true &&
    Array.isArray(schema.type) &&
    schema.type.indexOf("null") !== -1;

  const {
    privateValue: nullabilityPrivateValue,
    privateHandleChange: nullabilityPrivateHandleChange,
    isNull,
    setNull,
  } = useNullabilityMiddleware({
    publicValue: data,
    publicHandleChange: handleChange,
    path,
    isNullable,
  });

  // === fields repository connection ===

  // coercion function converts any data to valid data for the field
  // as well as it can
  const coerceData = useCallback(
    (givenValue) => {
      // preserve undefined
      if (givenValue === undefined) {
        return undefined;
      }

      // preserve null if nullable
      if (isNullable && givenValue === null) {
        return null;
      }

      // run the inner component coersion
      if (inputCoercionFunction) {
        return inputCoercionFunction(givenValue);
      } else {
        return givenValue;
      }
    },
    [isNullable, inputCoercionFunction],
  );

  fieldsRepository.useFieldsRepositoryConnection({
    fieldId,
    data,
    visible,
    handleChange,
    coerceData,
  });

  // === robot prediction data ===

  const fieldPrediction = robotPredictionStore.useFieldPrediction(fieldId);
  const hasPrediction = fieldPrediction.evidences != null;

  function toggleHumanVerified() {
    robotPredictionStore.patchFieldPrediction(fieldId, {
      isHumanVerified: !fieldPrediction.isHumanVerified,
    });
  }

  function updateFieldStateWithChange(newData: any) {
    if (newData !== fieldPrediction.predictedValue) {
      // TODO: update matchesFormData or something? Idk...
    }
  }

  // === debugging ===

  const [displayDebugInfo] = useAtom(userPreferencesStore.displayDebugInfoAtom);

  /////////////
  // Actions //
  /////////////

  // called with onChange before input debouncing and handleChange
  function observeChange(newData: any) {
    updateFieldStateWithChange(newData);
  }

  function onFocus() {
    setFieldActive();
  }

  /////////////////////////
  // Props for the child //
  /////////////////////////

  const controlInputProps = {
    ...props,

    // intercepted jsonforms props
    handleChange: nullabilityPrivateHandleChange,
    data: nullabilityPrivateValue,

    // doc-marker
    fieldId,
    htmlId,
    onFocus,
    observeChange,
    isFieldActive,
  };

  ///////////////
  // Rendering //
  ///////////////

  const theme = useTheme();

  let fieldBackground: string | undefined = undefined;

  if (isFieldActive)
    fieldBackground = alpha(theme["palette"]["primary"]["main"], 0.11);

  const unknownValueLabel = useMemo(
    () => t("unknown.value", "Unknown", { schema, uischema, path }),
    [t, schema, uischema, path],
  );

  const unknownTooltipLabel = useMemo(
    () => t("unknown.tooltip", "Set as unknown", { schema, uischema, path }),
    [t, schema, uischema, path],
  );

  return (
    <Paper
      sx={{
        // visibility normally toggles "display: none",
        // but if the debug mode is enabled, invisible controls are
        // rendered, only at 50% opacity.
        display: visible || displayDebugInfo ? "block" : "none",
        opacity: !visible && displayDebugInfo ? 0.5 : undefined,
        position: "relative",
        overflow: "hidden",

        // the controls themselves have margin, grid does not
        ml: 2,
        mt: 2,
      }}
      onClick={() => {
        if (!fieldPrediction.isBeingPredicted) {
          setFieldActive();
        }
      }}
    >
      <InputLabel className={styles["field-label"]} htmlFor={htmlId}>
        {label || `${fieldId}`}
      </InputLabel>
      <Divider />
      <div
        className={[
          styles["field-row"],
          isFieldActive ? styles["field-row--active"] : "",
        ].join(" ")}
        style={{ background: fieldBackground }}
      >
        {/* Nullability */}
        {isNullable ? (
          <Tooltip title={unknownTooltipLabel} disableInteractive>
            <ToggleButton
              className={styles["field-unknown-button"]}
              value="check"
              size="small"
              sx={{ mr: "10px" }}
              selected={isNull}
              onChange={() => {
                setNull(!isNull);
                setFieldActive();
              }}
              tabIndex={-1}
            >
              <HideSourceIcon />
            </ToggleButton>
          </Tooltip>
        ) : null}

        {/* The child or "unknown" */}
        {isNullable && isNull ? (
          <InputBase value={unknownValueLabel} fullWidth={true} />
        ) : (
          <InnerComponent {...controlInputProps} />
        )}

        <HighlightPinButton />

        {/* Robot value verification button */}
        {hasPrediction ? (
          <ToggleButton
            size="small"
            color="primary"
            value="check"
            selected={fieldPrediction.isHumanVerified}
            onChange={toggleHumanVerified}
          >
            <SmartToyIcon />
            <CheckIcon />
          </ToggleButton>
        ) : (
          ""
        )}
      </div>
      {errors === "" ? (
        ""
      ) : (
        <FormHelperText className={styles["field-error-message"]} error={true}>
          {errors}
        </FormHelperText>
      )}
      {fieldPrediction.isBeingPredicted && (
        <Backdrop
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(255, 255, 255, 0.8)",
          }}
          open={true}
          // onClick={handleClose}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
    </Paper>
  );
}
