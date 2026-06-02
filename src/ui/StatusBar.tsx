import { Typography, useTheme } from "@mui/material";
import { useAtomValue } from "jotai";
import { useContext } from "react";
import { DocMarkerContext } from "./DocMarkerContext";
import { AppMode } from "../state/AppMode";

/**
 * A debugging-only bar at the bottom of the application.
 */
export function StatusBar() {
  const theme = useTheme();

  const { fileMetadataStore, fieldsRepository, reportStore, editorStore } =
    useContext(DocMarkerContext);

  const displayDebugInfo = useAtomValue(editorStore.displayDebugInfoAtom);

  const appMode = useAtomValue(editorStore.appModeAtom);
  const fileUuid = useAtomValue(fileMetadataStore.fileUuidAtom);

  const formats = useAtomValue(reportStore.selectionFormatsAtom);
  const selection = useAtomValue(reportStore.selectionRangeAtom);

  const activeFieldId = useAtomValue(editorStore.activeFieldIdAtom);
  const activeFieldValue = activeFieldId
    ? fieldsRepository.useExportedValueOf(activeFieldId)
    : undefined;

  ////////////
  // Render //
  ////////////

  if (!displayDebugInfo) {
    return null;
  }

  return (
    <div
      style={{
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: "2px 10px",
      }}
    >
      <Typography variant="body2" component="p">
        <strong>File UUID:</strong> {fileUuid || "null"}
        {appMode === AppMode.EDIT_TEXT && (
          <>
            &nbsp;&nbsp;•&nbsp;&nbsp;
            <strong>Selection:</strong> {JSON.stringify(selection)}
            &nbsp;&nbsp;•&nbsp;&nbsp;
            <strong>Formats:</strong> {JSON.stringify(formats)}
          </>
        )}
        {appMode === AppMode.ANNOTATE_HIGHLIGHTS && (
          <>
            &nbsp;&nbsp;•&nbsp;&nbsp;
            <strong>Active field ID:</strong> {activeFieldId || "null"}
            &nbsp;&nbsp;•&nbsp;&nbsp;
            <strong>Active field value:</strong>{" "}
            {activeFieldValue === undefined
              ? "undefined"
              : JSON.stringify(activeFieldValue)}
          </>
        )}
      </Typography>
    </div>
  );
}
