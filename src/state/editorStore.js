import { atom } from "jotai"
import { AppMode } from "./editor/AppMode"

export const appModeAtom = atom(AppMode.EDIT_TEXT)

export const activeFieldIdAtom = atom(null)
