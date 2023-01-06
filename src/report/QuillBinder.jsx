import { useEffect, useRef } from "react"

/**
 * Binds the quill instance with the DOM as a react component
 */
export function QuillBinder({ quillManager, appMode, activeFieldId }) {
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
    <div style={{ border: "3px solid black", padding: "20px", margin: "20px" }}>
      <pre ref={debugRef}></pre>
      <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"></link>
      <div ref={bindingContainerRef}></div>
    </div>
  )
}