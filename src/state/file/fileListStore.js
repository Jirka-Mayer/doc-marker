import { atom } from "jotai"

const FILE_LIST_KEY = "docMarkerFileList"
const FILE_KEY_PREFIX = "docMarkerFile/" // + file UUID

const localStorage = window.localStorage

/**
 * Stores the file list in memory
 */
const fileListBaseAtom = atom([])

/**
 * Provides read-only access to the file list
 */
export const fileListAtom = atom(get => get(fileListBaseAtom))

// export const reloadFileListAtom
