import { useCallback, useEffect } from "react"
import * as reportStore from "../../state/reportStore"
import * as editorStore from "../../state/editorStore"
import { AppMode } from "../../state/editor/AppMode"
import { useAtom } from "jotai"
import {
  openMenuAtom as openAfterClickMenuAtom
} from "./anonymization/AfterClickMenu"
import {
  openMenuAtom as openAfterDragMenuAtom
} from "./anonymization/AfterDragMenu"

const quillExtended = reportStore.quillExtended

export function useAnonymizationController() {
  const [appMode] = useAtom(editorStore.appModeAtom)
  const [,openAfterClickMenu] = useAtom(openAfterClickMenuAtom)
  const [,openAfterDragMenu] = useAtom(openAfterDragMenuAtom)

  const onSelectionChange = useCallback((range, oldRange, source) => {
    handleSelectionChange(range, openAfterClickMenu, openAfterDragMenu)
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

function handleSelectionChange(range, openAfterClickMenu, openAfterDragMenu) {
  // if the selection is outside quill, do nothing
  if (range === null)
    return

  if (range.length === 0) {
    handleClick(range.index, openAfterClickMenu)
  } else {
    handleDrag(range, openAfterDragMenu)
  }
}

function handleClick(index, openAfterClickMenu) {
  // ignore clicks around the text
  if (!quillExtended.isClickInsideText(index))
    return
  
  // get anonymized range
  const anonymizedRange = quillExtended.getAnonymizedRange(index)

  // the click was not over any anonymized range
  if (anonymizedRange === null)
    return

  // show the context menu
  openAfterClickMenu(anonymizedRange)
}

function handleDrag(range, openAfterDragMenu) {
  // open context menu that asks for the kind of anonymized data
  openAfterDragMenu(range)
}
