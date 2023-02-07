import { useEffect, useRef } from "react"
import * as styles from "./QuillBinder.module.scss"
import { quillManager } from "../../../state/reportStore"

/**
 * Binds the quill instance with the DOM as a react component
 */
export function QuillBinder({ appMode, activeFieldId }) {
  const bindingContainerRef = useRef(null)
  
  useEffect(() => {
    quillManager.attachTo(bindingContainerRef.current)
  })

  useEffect(() => {
    quillManager.renderAppMode(appMode)
  }, [appMode])

  useEffect(() => {
    quillManager.renderFieldActivity(activeFieldId)
  }, [activeFieldId])

  const debugRef = useRef(null)
  useEffect(() => {
    let text = ""
    let m = quillManager.numberAllocator.idToNumber
    for (let k of m.keys()) {
      text += k + " => " + m.get(k) + "\n"
    }
    debugRef.current.innerText = text
  })
  
  return (
    <>
      {/* <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"></link> */}
      
      <div ref={bindingContainerRef}></div>

      <pre ref={debugRef}></pre>
    </>
  )
}