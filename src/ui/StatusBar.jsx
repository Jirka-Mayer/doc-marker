import { Typography, useTheme } from "@mui/material";
import { useAtom } from "jotai";
import { activeFieldIdAtom } from "../state/editorStore";
import { fileUuidAtom } from "../state/fileStore";
import { displayDebugInfoAtom } from "../state/userPreferencesStore";
import * as formStore from "../state/formStore"

/**
 * A debugging-only bar at the bottom of the application.
 */
export function StatusBar() {
  const theme = useTheme()

  const [displayDebugInfo] = useAtom(displayDebugInfoAtom)
  
  const [activeFieldId] = useAtom(activeFieldIdAtom)
  const [fileUuid] = useAtom(fileUuidAtom)

  const activeFieldValue = formStore.useGetExportedValue(activeFieldId)

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
        &nbsp;&nbsp;•&nbsp;&nbsp;
        <strong>Active field ID:</strong> {activeFieldId || "null"}
        &nbsp;&nbsp;•&nbsp;&nbsp;
        <strong>Active field value:</strong> {
          activeFieldValue === undefined ? "undefined" : JSON.stringify(activeFieldValue)
        }

      </Typography>
    </div>
  )
}