import * as styles from "./ReportColumn.module.scss";
import { QuillBinder } from "./QuillBinder";
import { Paper } from "@mui/material";
import * as editorStore from "../../state/editorStore";
import * as reportStore from "../../state/reportStore";
import * as userPreferencesStore from "../../state/userPreferencesStore";
import { useAtom } from "jotai";
import { ReportLanguageButton } from "./ReportLanguageButton";
import { AppMode } from "../../state/editor/AppMode";

export function ReportColumn() {
  const [appMode] = useAtom(editorStore.appModeAtom);
  const [displayDebugInfo] = useAtom(userPreferencesStore.displayDebugInfoAtom);
  const [content] = useAtom(reportStore.contentAtom);
  const [highlights] = useAtom(reportStore.highlightsAtom);

  const paperVisible = appMode === AppMode.EDIT_TEXT;

  return (
    <div className={styles["scroll-container"]}>
      <div className={styles["content"]}>
        <ReportLanguageButton />

        <Paper
          className={
            styles["quill-paper"] +
            " " +
            (paperVisible ? "" : styles["quill-paper--invisible"])
          }
          square
          elevation={paperVisible ? 1 : 0}
        >
          <QuillBinder />
        </Paper>

        {displayDebugInfo ? (
          <>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              Highlights: {JSON.stringify(highlights, null, 2)}
            </pre>

            <pre style={{ whiteSpace: "pre-wrap" }}>
              Content: {JSON.stringify(content, null, 2)}
            </pre>
          </>
        ) : null}
      </div>
    </div>
  );
}
