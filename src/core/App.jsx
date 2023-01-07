import * as styles from "./App.module.scss"
import { Form } from "../form/Form"
import { useState } from "react"
import { AppMode } from "./AppMode"
import { useReportStore } from "../report/ReportStore"
import { QuillBinder } from "../report/QuillBinder"

export function App() {

  const {
    quillManager, highlights, content, reportStoreDispatch
  } = useReportStore()

  const [mode, setMode] = useState(AppMode.ANNOTATE_HIGHLIGHTS)
  const [activeFieldId, setActiveFieldId] = useState(null)
  
  return (
    <>
      <div>
        ~Top toolbar <a href="./copy-test.html">copy-test</a>
        <hr/>
        <button
          disabled={mode === AppMode.EDIT_TEXT}
          onClick={() => {setMode(AppMode.EDIT_TEXT)}}
        >Edit Text</button>
        <button
          disabled={mode === AppMode.ANNOTATE_HIGHLIGHTS}
          onClick={() => {setMode(AppMode.ANNOTATE_HIGHLIGHTS)}}
        >Annotate Highlights</button>
        <hr />
        <button
          disabled={activeFieldId === null}
          onClick={() => {setActiveFieldId(null)}}
        >Activate no field</button>
        {[...Array(5).keys()].map((x, i) =>
          <button
            key={i}
            disabled={activeFieldId == i.toString()}
            onClick={() => {setActiveFieldId(i.toString())}}
          >Activate field {i}</button>
        )}
        <code>Active field: {JSON.stringify(activeFieldId)}</code>
      </div>

      <hr />

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