import * as styles from "./ReportColumn.module.scss"
import { QuillBinder } from "./QuillBinder"
import { Paper } from "@mui/material"
import { AppMode } from "../../state/editor/AppMode"
import { useAtom } from "jotai"
import { displayDebugInfoAtom } from "../../state/userPreferencesStore"
import { highlightsAtom, contentAtom } from "../../state/reportStore"
import { appModeAtom } from "../../state/editorStore"

export function ReportColumn() {
  const [appMode] = useAtom(appModeAtom)
  const [displayDebugInfo] = useAtom(displayDebugInfoAtom)
  const [content] = useAtom(contentAtom)
  const [highlights] = useAtom(highlightsAtom)

  const paperVisible = appMode === AppMode.EDIT_TEXT

  return (
    <div className={styles["scroll-container"]}>
      <div className={styles["content"]}>
        
        <Paper
          className={styles["quill-paper"] + " " + (paperVisible ? "" : styles["quill-paper--invisible"])}
          square
          elevation={paperVisible ? 1 : 0}
        >
          <QuillBinder />
        </Paper>
        
        { displayDebugInfo ? <>
          <pre
            style={{ whiteSpace: "pre-wrap" }}
          >Highlights: { JSON.stringify(highlights, null, 2) }</pre>
        
          <pre
            style={{ whiteSpace: "pre-wrap" }}
          >Content: { JSON.stringify(content, null, 2) }</pre>
        </> : null }
        
      </div>
    </div>
  )
}