import { useCallback, useEffect } from "react"
import * as reportStore from "../../state/reportStore"
import * as editorStore from "../../state/editorStore"
import { AppMode } from "../../state/editor/AppMode"
import { useAtom } from "jotai"
import {
  openMenuAtom as openAfterClickMenuAtom
} from "./annotation/AfterClickMenu"
import {
  openMenuAtom as openAfterDragMenuAtom
} from "./annotation/AfterDragMenu"

const quillExtended = reportStore.quillExtended

/**
 * Controls report-related UI in the annotation mode
 */
export function useAnnotationController() {
  const [appMode] = useAtom(editorStore.appModeAtom)
  const [activeFieldId] = useAtom(editorStore.activeFieldIdAtom)
  const [,openAfterClickMenu] = useAtom(openAfterClickMenuAtom)
  const [,openAfterDragMenu] = useAtom(openAfterDragMenuAtom)
  
  const onSelectionChange = useCallback((range, oldRange, source) => {
    handleSelectionChange(
      range,
      activeFieldId,
      openAfterClickMenu,
      openAfterDragMenu
    )
  }, [activeFieldId])
  
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
    if (appMode === AppMode.ANNOTATE_HIGHLIGHTS) {
      attach()
      return detach
    }
  }, [appMode, activeFieldId])
}

function handleSelectionChange(
  range,
  activeFieldId,
  openAfterClickMenu,
  openAfterDragMenu
) {
  // if no field is active, do nothing
  if (activeFieldId === null)
      return

  // if the selection is outside quill, do nothing
  if (range === null)
    return

  if (range.length === 0) {
    handleClick(range.index, activeFieldId, openAfterClickMenu)
  } else {
    handleDrag(range, openAfterDragMenu)
  }
}

function handleClick(index, activeFieldId, openAfterClickMenu) {
  // ignore clicks around the text
  if (!quillExtended.isClickInsideText(index))
    return

  // get highlight range
  const highlightRange = quillExtended.getHighlightRange(index, activeFieldId)

  // the click was not over any highlighted range
  if (highlightRange === null)
    return

  // show the context menu
  openAfterClickMenu(highlightRange)
}

function handleDrag(range, openAfterDragMenu) {
  // open the context menu that asks whether to add a new highlight range
  openAfterDragMenu(range)
}