import { useCallback, useEffect } from "react"
import { quillExtended } from "../../state/reportStore"
import { AppMode } from "../../state/editor/AppMode"
import { useAtom } from "jotai"
import { appModeAtom } from "../../state/editorStore"
import {
  openMenuAtom as openContextMenuAtom
} from "./anonymization/AnonymizationContextMenu"

export function useAnonymizationController() {
  const [appMode] = useAtom(appModeAtom)
  const [,openContextMenu] = useAtom(openContextMenuAtom)

  const onSelectionChange = useCallback((range, oldRange, source) => {
    handleSelectionChange(range, openContextMenu)
  }, [])

  function attach() {
    quillExtended.disable()
    quillExtended.enableWordSelection()
    quillExtended.on("selection-change", onSelectionChange)
  }

  function detach() {
    quillExtended.enable()
    quillExtended.disableWordSelection()
    quillExtended.off("selection-change", onSelectionChange)
  }

  // connect with react
  useEffect(() => {
    if (appMode === AppMode.ANONYMIZE) {
      attach()
      return detach
    }
  }, [appMode])
}

function handleSelectionChange(range, openContextMenu) {
  // if the selection is outside quill, do nothing
  if (range === null)
    return

  if (range.length === 0) {
    handleClick(range.index)
  } else {
    handleDrag(range, openContextMenu)
  }
}

function handleClick(index) {
  // ignore clicks around the text
  if (!quillExtended.isClickInsideText(index))
    return

  // TODO: open context menu that asks whther the anonymization should be removed

  // get anonymized range
  const anonymizedRange = quillExtended.getAnonymizedRange(index)

  // the click was not over any anonymized range
  if (anonymizedRange === null)
    return

  // remove the anonymization
  quillExtended.anonymizeText(anonymizedRange.index, anonymizedRange.length, "")
}

function handleDrag(range, openContextMenu) {
  // open context menu that asks for the kind of anonymized data
  openContextMenu(range)
}
