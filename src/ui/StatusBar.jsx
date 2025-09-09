import { Typography, useTheme } from "@mui/material";
import { useAtom } from "jotai";
import * as editorStore from "../state/editorStore";
import * as reportStore from "../state/reportStore";
import * as userPreferencesStore from "../state/userPreferencesStore";
import { useContext } from "react";
import { DocMarkerContext } from "./DocMarkerContext";
import { AppMode } from "../state/editor/AppMode";

/**
 * A debugging-only bar at the bottom of the application.
 */
export function StatusBar() {
  const theme = useTheme()

  const { fileMetadataStore, fieldsRepository } = useContext(DocMarkerContext);

  const [displayDebugInfo] = useAtom(userPreferencesStore.displayDebugInfoAtom)
  
  const [appMode] = useAtom(editorStore.appModeAtom)
  const [fileUuid] = useAtom(fileMetadataStore.fileUuidAtom)
  
  const [formats] = useAtom(reportStore.selectionFormatsAtom)
  const [selection] = useAtom(reportStore.selectionRangeAtom)
  
  const [activeFieldId] = useAtom(editorStore.activeFieldIdAtom)
  const activeFieldValue = fieldsRepository.useExportedValueOf(activeFieldId)

  ////////////
  // Render //
  ////////////

  if (!displayDebugInfo)
    return null
  
  return (
    <div style={{
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      padding: "2px 10px"
    }}>
      <Typography variant="body2" component="p">

        <strong>File UUID:</strong> {fileUuid || "null"}
        
        { appMode === AppMode.EDIT_TEXT && <>
          &nbsp;&nbsp;•&nbsp;&nbsp;
          <strong>Selection:</strong> { JSON.stringify(selection) }
          &nbsp;&nbsp;•&nbsp;&nbsp;
          <strong>Formats:</strong> { JSON.stringify(formats) }
        </>}

        { appMode === AppMode.ANNOTATE_HIGHLIGHTS && <>
          &nbsp;&nbsp;•&nbsp;&nbsp;
          <strong>Active field ID:</strong> {activeFieldId || "null"}
          &nbsp;&nbsp;•&nbsp;&nbsp;
          <strong>Active field value:</strong> {
            activeFieldValue === undefined ? "undefined" : JSON.stringify(activeFieldValue)
          }
        </>}

      </Typography>
    </div>
  )
}