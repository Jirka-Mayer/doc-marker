import React, { useState, useEffect, useRef } from "react"
import Quill from "quill"
import * as styles from "./Report.module.scss"

export function Report() {
  const quillRef = useRef(null)
  let quill = null

  useEffect(() => {
    quill = new Quill(quillRef.current, {
      theme: "snow",
      placeholder: "Paste discharge report here...\nTODO: Localization",
      formats: [
        // inline
        "bold", "italic", "underline", "strike", "script",

        // block
        "header"
      ]
    })
  })

  return (
    <div className={styles["debug-container"]}>
      <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"></link>
      <div ref={quillRef}></div>
      <button onClick={() => {quill.enable(false)}}>Disable editing</button>
      <button onClick={() => {quill.enable(true)}}>Enable editing</button>
    </div>
  )
}
