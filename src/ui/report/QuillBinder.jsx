import { useEffect, useRef } from "react"
import * as styles from "./QuillBinder.module.scss"
import { quillExtended } from "../../state/reportStore"
import { useAtom } from "jotai"
import { activeFieldIdAtom, appModeAtom } from "../../state/editorStore"
import { displayDebugInfoAtom } from "../../state/userPreferencesStore"

/**
 * Binds the quill instance with the DOM as a react component
 */
export function QuillBinder() {
  const [appMode] = useAtom(appModeAtom)
  const [activeFieldId] = useAtom(activeFieldIdAtom)
  const [displayDebugInfo] = useAtom(displayDebugInfoAtom)
  
  const bindingContainerRef = useRef(null)
  
  useEffect(() => {
    quillExtended.attachTo(bindingContainerRef.current)
  })

  useEffect(() => {
    quillExtended.renderAppMode(appMode)
  }, [appMode])

  useEffect(() => {
    quillExtended.renderFieldActivity(activeFieldId)
  }, [activeFieldId])

  const debugRef = useRef(null)
  useEffect(() => {
    let text = ""
    let m = quillExtended.highlightsAllocator.idToNumber
    if (displayDebugInfo) {
      for (let k of m.keys()) {
        text += k + " => " + m.get(k) + "\n"
      }
    }
    debugRef.current.innerText = text
  }, [displayDebugInfo])
  
  return (
    <>
      {/* <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"></link> */}
      
      <div ref={bindingContainerRef}></div>

      <pre ref={debugRef}></pre>
    </>
  )
}