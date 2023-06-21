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

const fileCreatedAtBaseAtom = atom(null)

/**
 * When was the openned file created, as a Date instance
 */
export const fileCreatedAtAtom = atom(get => get(fileCreatedAtBaseAtom))

/**
 * Returns the assigned patient ID of the file, or null if none was assigned yet
 */
export const patientIdAtom = atom(null)

/**
 * Returns the name of the file
 */
export const fileNameAtom = atom(
  get => AppFile.constructFileName(get(patientIdAtom), get(fileUuidAtom))
)


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
    "_createdAt": get(fileCreatedAtBaseAtom).toISOString(),
    "_updatedAt": new Date().toISOString(),
    
    "_formId": get(formStore.formIdAtom),
    "_formData": formStore.getExportedFormData(),
    
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

  const json = appFile.toJson()

  if (json["_version"] !== AppFile.CURRENT_VERSION)
    throw new Error("File to be deserialized must have the latest version number")

  set(fileUuidBaseAtom, json["_uuid"])
  set(fileCreatedAtBaseAtom, new Date(json["_createdAt"]))
  // _updatedAt is ignored, since it's overwritten during save anyways

  set(formStore.formIdAtom, json["_formId"])
  set(formStore.formDataAtom, json["_formData"])
  formStore.initiateExportRefresh()

  reportStore.quillExtended.setContents(json["_reportDelta"])
  // _reportText and _highlights are ignored, since they are computable from delta

  set(patientIdAtom, json["patientId"])
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
 * Downloads a stored file, given its UUID
 */
 export const downloadFileAtom = atom(null, (get, set, uuid) => {
  const appFile = FileStorage.loadFile(uuid)
  appFile.download()
})

/**
 * Deletes a file from the browser storage, given its UUID
 */
export const deleteFileAtom = atom(null, (get, set, uuid) => {
  FileStorage.deleteFile(uuid)
  set(refreshFileListAtom)
})

/**
 * Stores the file into the file storage,
 * ovewriting any existing file with the same UUID
 */
 export const storeFileAtom = atom(null, (get, set, appFile) => {
  FileStorage.storeFile(appFile)
  set(refreshFileListAtom)
})


/////////////////////////////
// Current File Operations //
/////////////////////////////

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

/**
 * Call to open a stored file. You need to provide its UUID
 */
export const openFileAtom = atom(null, (get, set, uuid) => {
  const appFile = FileStorage.loadFile(uuid)
  set(deserializeFileAtom, appFile)

  if (get(formStore.formDataAtom) === null)
    set(editorStore.appModeAtom, AppMode.EDIT_TEXT)
  else
    set(editorStore.appModeAtom, AppMode.ANNOTATE_HIGHLIGHTS)
})

/**
 * Downloads the currently open file
 */
export const downloadCurrentFileAtom = atom(null, (get, set) => {
  const appFile = get(serializeFileAtom)
  appFile.download()
})
