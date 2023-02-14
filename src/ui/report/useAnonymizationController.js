import { useCallback, useEffect } from "react"
import { quillExtended } from "../../state/reportStore"
import { AppMode } from "../../state/editor/AppMode"
import { useAtom } from "jotai"
import { appModeAtom } from "../../state/editorStore"

export function useAnonymizationController() {
  const [appMode] = useAtom(appModeAtom)

  const onSelectionChange = useCallback((range, oldRange, source) => {
    handleSelectionChange(range)
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

function handleSelectionChange(range) {
  // if the selection is outside quill, do nothing
  if (range === null)
    return

  // handle when the user just clicks the text area
  if (range.length === 0)
    handleClick(range.index)

  // handle when the user actually drags the text area
  handleDrag(range)
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

function handleDrag(range) {
  // TODO: open context menu that asks for the kind of anonymized data
  
  // anonymize the text
  quillExtended.anonymizeText(range.index, range.length, "other")

  // clear selection silently (to not trigger the click event above)
  quillExtended.setSelection(range.index, 0, "silent")
}
