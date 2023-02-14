import { useCallback, useEffect } from "react"
import { quillExtended } from "../../state/reportStore"
import { AppMode } from "../../state/editor/AppMode"
import { useAtom } from "jotai"
import { activeFieldIdAtom, appModeAtom } from "../../state/editorStore"

/**
 * Controls report-related UI in the annotation mode
 */
export function useAnnotationController() {
  const [appMode] = useAtom(appModeAtom)
  const [activeFieldId] = useAtom(activeFieldIdAtom)
  
  const onSelectionChange = useCallback((range, oldRange, source) => {
    handleSelectionChange(range, activeFieldId)
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

function handleSelectionChange(range, activeFieldId) {
  // if no field is active, do nothing
  if (activeFieldId === null)
      return

  // if the selection is outside quill, do nothing
  if (range === null)
    return

  if (range.length === 0) {
    handleClick(range.index, activeFieldId)
  } else {
    handleDrag(range, activeFieldId)
  }
}

function handleClick(index, activeFieldId) {
  // ignore clicks around the text
  if (!quillExtended.isClickInsideText(index))
    return

  // get highlight range
  const highlightRange = quillExtended.getHighlightRange(index, activeFieldId)

  // the click was not over any highlighted range
  if (highlightRange === null)
    return

  // remove the highlight
  quillExtended.highlightText(
    highlightRange.index,
    highlightRange.length,
    activeFieldId,
    false
  )
}

function handleDrag(range, activeFieldId) {
  // highlight the text
  quillExtended.highlightText(range.index, range.length, activeFieldId)

  // clear selection silently (to not trigger the click event above)
  quillExtended.setSelection(range.index, 0, "silent")
}