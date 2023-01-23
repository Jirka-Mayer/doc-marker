import { atom } from "jotai"
import { contentAtom, quillManager } from "../report/reportStore"
import { formDataAtom } from "../form/formStore"
import { PatientFile } from "./PatientFile"


// === private backing-field (base) atoms ===

/**
 * GUID of the open file. If null, no file is open.
 */
const fileGuidBaseAtom = atom(null)


// === public read-only atoms ===

export const isFileOpenAtom = atom(get => get(fileGuidBaseAtom) !== null)

export const patientIdAtom = atom(null)


// === public action atoms ===

export const openFileAtom = atom(null, (get, set, appFile) => {
  const patientId = appFile.getPatientId()
  const reportDelta = appFile.getReportDelta()
  const formData = appFile.getFormData()

  set(patientIdAtom, patientId)
  quillManager.setContents(reportDelta)
  set(formDataAtom, formData)

  // TODO: implement GUIDs
  set(fileGuidBaseAtom, "some-guid")

  // TODO: extract app mode into a store
  // setMode(formData === null ? AppMode.EDIT_TEXT : AppMode.ANNOTATE_HIGHLIGHTS)
})

export const closeFileAtom = atom(null, (get, set) => {
  // TODO: save file to local storage

  // close file
  set(fileGuidBaseAtom, null)
})

export const downloadFileAtom = atom(null, (get, set) => {
  const patientId = get(patientIdAtom)
  
  // create app file
  const file = PatientFile.fromApplicationState({
    patientId,
    reportDelta: get(contentAtom),
    formData: get(formDataAtom)
  })

  // export JSON
  const json = file.toPrettyJson()

  // download file
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json)
  var a = document.createElement("a")
  a.setAttribute("href", dataStr)
  a.setAttribute("download", patientId + ".resq.json")
  a.click()
})
