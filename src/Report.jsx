import React, { useState, useEffect, useRef } from "react"
import Quill from "quill"
import * as styles from "./Report.module.scss"
import { highlightAttributorFactory } from "./highlightAttributorFactory"

Quill.register(
  highlightAttributorFactory(
    "highlight",
    styles["highlight"],
    Object.keys(styles)
      .filter(k => k.indexOf("highlight-") === 0)
      .map(k => k.substring(10))
  )
)

export function Report() {
  const quillRef = useRef(null)
  let quill = null

  function focusField(field) {
    if (styles["focus-" + field] === undefined) {
      // TODO: implement some centralized error reporting
      alert(`ERROR: The field ${field} is not in the stylesheet. Update the @for loop bounds accordingly.`)
      return
    }

    const matches = (quillRef.current.getAttribute('class') || '')
      .split(/\s+/)
      .filter((name) => name.indexOf(styles["focus"] + "-") === 0)
    matches.forEach((name) => {
      quillRef.current.classList.remove(name)
    })
    
    quillRef.current.classList.add(styles["focus"] + "-" + field)
  }

  useEffect(() => {
    quill = new Quill(quillRef.current, {
      theme: "snow",
      placeholder: "Paste discharge report here...\nTODO: Localization",
      formats: [
        // inline
        "bold", "italic", "underline", "strike", "script",
        
        // block
        "header",
        
        // custom
        "highlight"
      ]
    })

    quill.setContents([
      { insert: "Hello " },
      { insert: "world!", attributes: { highlight: "0" } },
      { insert: "\n" },
      { insert: "Hello", attributes: { highlight: "1" } },
      { insert: " world!\n"}
    ])

    focusField("0")

    // expose quill to the browser console
    window.quill = quill
  })

  return (
    <div className={styles["debug-container"]}>
      <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"></link>
      <div ref={quillRef}></div>
      <hr />
      <button onClick={() => {quill.enable(false)}}>Disable editing</button>
      <button onClick={() => {quill.enable(true)}}>Enable editing</button>
      <hr />
      {[...Array(5).keys()].map((x, i) =>
        <button key={i} onClick={() => {focusField(i.toString())}}>Focus field {i}</button>
      )}
    </div>
  )
}
