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
    if (appMode !== AppMode.ANNOTATE_HIGHLIGHTS)
      return
    
    attach()
    
    return () => {
      detach()
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

  // handle when the user just clicks the text area
  if (range.length === 0)
    handleClick(range.index, activeFieldId)
  
  // handle when the user actually drags the text area
  handleDrag(range, activeFieldId)
}

function handleClick(index, activeFieldId) {
  // clicking after the end of line does nothing
  if (quillExtended.getText(index, 1) == "\n")
    return

  // clicking before the start of line does nothing
  if (quillExtended.getText(index - 1, 1) == "\n")
    return

  // clicking before the start of text does nothing
  if (index == 0)
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