import * as styles from "./Application.module.scss"
import { useState } from "react"
import { AppMode } from "./AppMode"
import { AppBar } from "./AppBar"
import { WelcomeBody } from "./WelcomeBody"
import { PatientFile } from "../core/PatientFile"
import { StatusBar } from "./StatusBar"
import { AppBody } from "./AppBody"
import JotaiNexus from "./JotaiNexus"
import { quillManager, contentAtom } from "../report/reportStore"
import { useAtom } from "jotai"

/*
  APPLICATION STATE
  -----------------

  - app file store ......... jotai atoms, nice
    - guid
    - last modified at timestamp
    - patient ID
  - report store ........ jotai nexus (build myself)
    - content
    - highlights
  - form store ....... json forms data object (but could be rewritten to use atoms for the data for better performance)
    - data schema
    - UI schema
    - data
    - errors
    - field states
  - editor state store ....... jotai atoms
    - active field
    - app mode
  - user preferences store ....... jotai atoms, nice
    - debug mode
    - localization
*/

export function Application() {

  const [content] = useAtom(contentAtom)

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
    quillManager.setContents(_reportDelta)
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
      <JotaiNexus />
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

          appMode={mode}
          activeFieldId={activeFieldId}
          setActiveFieldId={setActiveFieldId}
          formData={formData}
          setFormData={setFormData}
        />

      </div>
      <div className={styles["status-bar-container"]}>

        <StatusBar />

      </div>
    </>
  )
}