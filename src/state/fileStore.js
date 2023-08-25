import { currentOptions } from "../options"
import { atom, getDefaultStore } from "jotai"
import { AppFile } from "../state/file/AppFile"
import { AppMode } from "./editor/AppMode"
import { FileStorage } from "./file/FileStorage"
import { EventEmitter } from "../utils/EventEmitter"
import * as reportStore from "./reportStore"
import * as formStore from "./formStore"
import * as editorStore from "./editorStore"
import * as historyStore from "./historyStore"
import * as packageJson from "../../package.json"
import { optionIs } from "@jsonforms/core"
import { Migration } from "./file/Migration"
import { forgetAnonymizedText } from "./file/forgetAnonymizedText"

const DOC_MARKER_VERSION = packageJson.version

// lets us manipulate atoms from the non-jotai/react code
const jotaiStore = getDefaultStore()

/**
 * Emits events related to the file store
 */
 export const eventEmitter = new EventEmitter()


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
 * Holds the user-specified file name
 */
export const fileNameAtom = atom("")

const fileCreatedAtBaseAtom = atom(null)

/**
 * When was the openned file created, as a Date instance
 */
export const fileCreatedAtAtom = atom(get => get(fileCreatedAtBaseAtom))


////////////////////////
// File Serialization //
////////////////////////

/**
 * Executing this function will serialize the currently open file
 * to an AppFile instance, or to null if no file is open
 */
function serializeToFile() {
  if (!jotaiStore.get(isFileOpenAtom))
    return null
  
  let fileJson = {
    "_version": currentOptions.file.currentVersion,
    "_docMarkerVersion": DOC_MARKER_VERSION,
    "_docMarkerCustomizationVersion": currentOptions.customization.version,
    "_docMarkerCustomizationName": currentOptions.customization.name,
    
    "_uuid": jotaiStore.get(fileUuidAtom),
    "_fileName": jotaiStore.get(fileNameAtom),
    "_createdAt": jotaiStore.get(fileCreatedAtBaseAtom).toISOString(),
    "_updatedAt": new Date().toISOString(),

    "_appMode": jotaiStore.get(editorStore.appModeAtom),
    
    "_formId": jotaiStore.get(formStore.formIdAtom),
    "_formData": formStore.getExportedFormData(),
    
    "_reportDelta": jotaiStore.get(reportStore.contentAtom),
    "_reportText": reportStore.quillExtended.getText(),
    "_highlights": jotaiStore.get(reportStore.highlightsAtom),
  }

  fileJson = forgetAnonymizedText(fileJson)
  
  fileJson = currentOptions.file.onSerialize(fileJson)

  return AppFile.fromJson(fileJson)
}

/**
 * Calling this function will deserialize the given app file into the
 * application state. Providing null will reset the editor to "no file" state.
 * @param {AppFile} appFile 
 */
function deserializeFromFile(appFile) {
  if (appFile === null) {
    jotaiStore.set(fileUuidBaseAtom, null)
    return
  }

  let json = appFile.toJson()

  json = Migration.runMigrations(json, currentOptions.file.migrations)

  // === deserialize state ===

  jotaiStore.set(fileUuidBaseAtom, json["_uuid"])
  jotaiStore.set(fileNameAtom, json["_fileName"])
  jotaiStore.set(fileCreatedAtBaseAtom, new Date(json["_createdAt"]))
  // _updatedAt is ignored, since it's overwritten during save anyways

  jotaiStore.set(editorStore.appModeAtom, json["_appMode"])

  jotaiStore.set(formStore.formIdAtom, json["_formId"])
  jotaiStore.set(formStore.formDataAtom, json["_formData"])
  formStore.initiateExportRefresh()

  reportStore.quillExtended.setContents(json["_reportDelta"], "api")
  // _reportText and _highlights are ignored, since they are computable from delta

  // let the customization deserialize its own additional state
  currentOptions.file.onDeserialize(json)
}


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
export function refreshFileListAtom() {
  jotaiStore.set(fileListBaseAtom, FileStorage.listFiles())
}

/**
 * Downloads a stored file, given its UUID
 */
export function downloadFile(uuid) {
  const appFile = FileStorage.loadFile(uuid)
  appFile.download()
}

/**
 * Deletes a file from the browser storage, given its UUID
 */
export function deleteFile(uuid) {
  FileStorage.deleteFile(uuid)
  refreshFileListAtom()
}

/**
 * Stores the file into the file storage,
 * ovewriting any existing file with the same UUID
 */
export function storeFile(appFile) {
  FileStorage.storeFile(appFile)
  refreshFileListAtom()
}


/////////////////////////////
// Current File Operations //
/////////////////////////////

/**
 * Creates a new file and opens it.
 * If a file is already open, it will save and close
 * that file and only then open the new file.
 */
export function createNewFile(formId) {
  closeFile()
  deserializeFromFile(AppFile.createNewEmpty(formId))
  historyStore.clear()
}

/**
 * Closes the currently open file.
 * (which may trigger save via event handler in the autosave store)
 */
export function closeFile() {
  eventEmitter.emit("beforeFileClose", {})

  jotaiStore.set(fileUuidBaseAtom, null)
}

/**
 * Saves the currently open file to local storage
 * (or does nothing if no file is open)
 */
export function saveCurrentFile() {
  if (!jotaiStore.get(isFileOpenAtom))
    return
  
  const appFile = serializeToFile()
  FileStorage.storeFile(appFile)
  refreshFileListAtom()

  eventEmitter.emit("fileSaved", { appFile })
}

/**
 * Opens a file from the local storage based on the given UUID
 */
export function openFile(uuid) {
  const appFile = FileStorage.loadFile(uuid)
  deserializeFromFile(appFile)
  historyStore.clear()
}

/**
 * Downloads the currently open file
 */
export function downloadCurrentFile() {
  const appFile = serializeToFile()
  appFile.download()
}
