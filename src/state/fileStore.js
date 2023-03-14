import { atom } from "jotai"
import { AppFile } from "../state/file/AppFile"
import { AppMode } from "./editor/AppMode"
import { FileStorage } from "./file/FileStorage"
import * as reportStore from "./reportStore"
import * as formStore from "./formStore"
import * as editorStore from "./editorStore"


///////////////////////////
// Openned file metadata //
///////////////////////////

const fileUuidBaseAtom = atom(null)

/**
 * Returns the uuid of the currently open file or null if no file is open
 */
export const fileUuidAtom = atom(get => get(fileUuidBaseAtom))

/**
 * True if a file is open
 */
export const isFileOpenAtom = atom(get => get(fileUuidBaseAtom) !== null)

/**
 * Returns the assigned patient ID of the file, or null if none was assigned yet
 */
export const patientIdAtom = atom(null)


////////////////////////
// File Serialization //
////////////////////////

/**
 * Reading this atom will serialize the currently open file
 * to an AppFile instance, or to null if no file is open
 */
const serializeFileAtom = atom(get => {
  if (!get(isFileOpenAtom))
    return null

  return AppFile.fromJson({
    "_version": AppFile.CURRENT_VERSION,
    
    "_uuid": get(fileUuidAtom),
    "_writtenAt": new Date().toISOString(),
    
    "_formId": get(formStore.formIdAtom),
    "_formData": get(formStore.formDataAtom),
    
    "_reportDelta": get(reportStore.contentAtom),
    "_reportText": reportStore.quillExtended.getText(),
    "_highlights": get(reportStore.highlightsAtom),

    "patientId": get(patientIdAtom),
  })
})

/**
 * Writing this atom will deserialize the given app file into the
 * application state. Providing null will reset the editor to "no file" state.
 */
const deserializeFileAtom = atom(null, (get, set, appFile) => {
  if (appFile === null) {
    set(fileUuidBaseAtom, null)
    return
  }

  json = appFile.toJson()

  if (json["_version"] !== AppFile.CURRENT_VERSION)
    throw new Error("File to be deserialized must have the latest version number")

  set(fileUuidAtom, json["_uuid"])

  set(formStore.formIdAtom, json["_formId"])
  set(formStore.formDataAtom, json["_formData"])

  reportStore.quillExtended.setContents(json["_reportDelta"])
  // report text and highlights are ignored

  set(patientIdAtom, json["patientId"])
})


///////////////////////////
// New File & Close File //
///////////////////////////

/**
 * Call to open a new file.
 * If a file is already openned, it will be saved.
 * The only required argument is the form ID to use.
 */
export const createNewFileAtom = atom(null, (get, set, formId) => {
  set(saveCurrentFileAtom)
  set(deserializeFileAtom, AppFile.createNewEmpty(formId))
})

/**
 * Call to close the current file.
 * It will also be saved.
 */
export const closeFileAtom = atom(null, (get, set) => {
  set(saveCurrentFileAtom)
  set(fileUuidBaseAtom, null)
})


//////////////////
// File Storage //
//////////////////

const fileListBaseAtom = atom(FileStorage.listFiles())

/**
 * Holds the list of stored files
 */
export const fileListAtom = atom(get => get(fileListBaseAtom))

/**
 * Call to refresh the list of stored files from the local storage
 */
export const refreshFileListAtom = atom(null, (get, set, _) => {
  set(fileListBaseAtom, FileStorage.listFiles())
})

/**
 * Call to save the current file.
 * Does nothing if no file is open.
 */
export const saveCurrentFileAtom = atom(null, (get, set) => {
  if (!get(isFileOpenAtom))
    return
  
  const appFile = get(serializeFileAtom)
  FileStorage.storeFile(appFile)
  set(refreshFileListAtom)
})


///////////////////////////////////////////////
// Legacy code to be rewritten into sections //
///////////////////////////////////////////////

export const openFileAtom = atom(null, (get, set, appFile) => {
  set(deserializeFileAtom, appFile)

  if (get(formStore.formDataAtom) === null)
    set(editorStore.appModeAtom, AppMode.EDIT_TEXT)
  else
    set(editorStore.appModeAtom, AppMode.ANNOTATE_HIGHLIGHTS)
})

export const downloadFileAtom = atom(null, (get, set) => {
  const patientId = get(patientIdAtom)
  
  // create app file
  const file = get(serializeFileAtom)

  // export JSON
  const jsonString = file.toPrettyJsonString()

  // download file
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString)
  var a = document.createElement("a")
  a.setAttribute("href", dataStr)
  a.setAttribute("download", patientId + ".resq.json")
  a.click()
})
