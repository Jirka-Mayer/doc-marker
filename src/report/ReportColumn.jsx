import * as styles from "./ReportColumn.module.scss"
import { QuillBinder } from "./QuillBinder"
import { Paper } from "@mui/material"
import { AppMode } from "../core/AppMode"
import { useAtom } from "jotai"
import { displayDebugInfoAtom } from "../core/userPreferencesStore"
import { highlightsAtom, contentAtom } from "./reportStore"

export function ReportColumn(props) {
  const {
    appMode,
    activeFieldId,
  } = props

  const paperVisible = appMode === AppMode.EDIT_TEXT

  const [displayDebugInfo] = useAtom(displayDebugInfoAtom)
  const [content] = useAtom(contentAtom)
  const [highlights] = useAtom(highlightsAtom)

  return (
    <div className={styles["scroll-container"]}>
      <div className={styles["content"]}>
        
        <Paper
          className={styles["quill-paper"] + " " + (paperVisible ? "" : styles["quill-paper--invisible"])}
          square
          elevation={paperVisible ? 1 : 0}
        >
          <QuillBinder
            appMode={appMode}
            activeFieldId={activeFieldId}
          />
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