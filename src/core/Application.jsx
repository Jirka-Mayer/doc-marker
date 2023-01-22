import * as styles from "./Application.module.scss"
import { useState } from "react"
import { AppMode } from "./AppMode"
import { useReportStore } from "../report/ReportStore"
import { AppBar } from "./AppBar"
import { WelcomeBody } from "./WelcomeBody"
import { PatientFile } from "../core/PatientFile"
import { StatusBar } from "./StatusBar"
import { AppBody } from "./AppBody"

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
      <div className={styles["app-bar-container"]}>
        
        <AppBar
          closeFile={() => {setMenuOpen(true)}}
          mode={mode}
          setMode={setMode}
          patientId={patientId}
          downloadFile={downloadFile}
        />
        
      </div>
      <div className={styles["app-body-container"]}>
        
        <WelcomeBody
          isOpen={isMenuOpen}

          applicationOpenFile={applicationOpenFile}
        />

        <AppBody
          isOpen={!isMenuOpen}

          quillManager={quillManager}
          appMode={mode}
          activeFieldId={activeFieldId}
          setActiveFieldId={setActiveFieldId}
          highlights={highlights}
          content={content}
          formData={formData}
          setFormData={setFormData}
          reportStoreDispatch={reportStoreDispatch}
        />

      </div>
      <div className={styles["status-bar-container"]}>

        <StatusBar />

      </div>
    </>
  )
}