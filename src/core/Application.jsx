import * as styles from "./Application.module.scss"
import { Form } from "../form/Form"
import { useState } from "react"
import { AppMode } from "./AppMode"
import { useReportStore } from "../report/ReportStore"
import { QuillBinder } from "../report/QuillBinder"
import { AppBar } from "./AppBar"
import { Menu } from "../menu/Menu"
import { PatientFile } from "../core/PatientFile"

export function Application() {

  const {
    quillManager, highlights, content, reportStoreDispatch
  } = useReportStore()

  const [isMenuOpen, setMenuOpen] = useState(true)
  const [mode, setMode] = useState(AppMode.EDIT_TEXT)
  const [activeFieldId, setActiveFieldId] = useState(null)
  const [patientId, setPatientId] = useState(null)
  const [formData, setFormData] = useState(null)
  
  function applicationOpenFile(patientFile) {
    const _patientId = patientFile.getPatientId()
    const _reportDelta = patientFile.getReportDelta()
    const _formData = patientFile.getFormData()

    setPatientId(_patientId)
    reportStoreDispatch({
      type: "setContents",
      delta: _reportDelta
    })
    setFormData(_formData)

    setMode(_formData === null ? AppMode.EDIT_TEXT : AppMode.ANNOTATE_HIGHLIGHTS)
    setMenuOpen(false)
  }

  function downloadFile() {
    // create patient file
    const file = PatientFile.fromApplicationState({
      patientId,
      reportDelta: content,
      formData
    })

    // export JSON
    const json = file.toPrettyJson()

    // download file
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json)
    var a = document.createElement("a")
    a.setAttribute("href", dataStr)
    a.setAttribute("download", patientId + ".resq.json")
    a.click()
  }

  return (
    <>
      <Menu isMenuOpen={isMenuOpen} applicationOpenFile={applicationOpenFile} />

      <AppBar
        closeFile={() => {setMenuOpen(true)}}
        mode={mode}
        setMode={setMode}
        patientId={patientId}
        downloadFile={downloadFile}
      />

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
            formData={formData}
            setFormData={setFormData}
          />

        </div>
      </div>
    </>
  )
}