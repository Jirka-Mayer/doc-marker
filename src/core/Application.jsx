import * as styles from "./Application.module.scss"
import { Form } from "../form/Form"
import { useState } from "react"
import { AppMode } from "./AppMode"
import { useReportStore } from "../report/ReportStore"
import { QuillBinder } from "../report/QuillBinder"
import { AppBar } from "./AppBar"

export function Application() {

  const {
    quillManager, highlights, content, reportStoreDispatch
  } = useReportStore()

  const [mode, setMode] = useState(AppMode.ANNOTATE_HIGHLIGHTS)
  const [activeFieldId, setActiveFieldId] = useState(null)
  
  return (
    <>
      <AppBar mode={mode} setMode={setMode} />

      <div className={styles["columns-container"]}>
        <div className={styles["column"]}>
          
          <QuillBinder
            quillManager={quillManager}
            appMode={mode}
            activeFieldId={activeFieldId}
          />
          
          <pre>Highlights: { JSON.stringify(highlights) }</pre>
          <button onClick={() => reportStoreDispatch({ type: "add", highlight: "a", value: 42 })}>Set 42</button>
          <pre>Content: { JSON.stringify(content, null, 2) }</pre>

          <div>
            <a href="./copy-test.html">copy-test</a>
            <hr />
            <button
              disabled={activeFieldId === null}
              onClick={() => {setActiveFieldId(null)}}
            >Activate no field</button>
            {[...Array(2).keys()].map((x, i) =>
              <button
                key={i}
                disabled={activeFieldId == i.toString()}
                onClick={() => {setActiveFieldId(i.toString())}}
              >Activate field {i}</button>
            )}
            <code>Active field: {JSON.stringify(activeFieldId)}</code>
          </div>

        </div>
        <div className={styles["separator"]}></div>
        <div className={styles["column"]}>
          
          <Form
            activeFieldId={activeFieldId}
            setActiveFieldId={fn => setActiveFieldId(fn)}
          />

        </div>
      </div>
    </>
  )
}