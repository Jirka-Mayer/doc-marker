import React, { useState, useEffect, useRef } from "react"
import Quill from "quill"
import * as styles from "./Report.module.scss"
import { highlightAttributorFactory } from "./highlightAttributorFactory"

Quill.register(
  highlightAttributorFactory(
    "highlight",
    styles["highlight"],
    Object.keys(styles) // whitelist of possible values
      .filter(k => k.indexOf("highlight-") === 0)
      .map(k => k.substring(10))
  ),
  true // no warnings
)

// NOTE: Class compomnents are better suited for integration with 3rd party
// libraries that manipulate DOM than functional components.
export class Report extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // TODO: this will later come to us via props
      focusedField: "0"
    }

    this.containerElement = null
    this.quillElement = null
  }
  
  componentDidMount() {
    this.quillElement = document.createElement("div")
    this.containerElement.appendChild(this.quillElement)

    this.quill = new Quill(this.quillElement, {
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

    this.quill.setContents([
      { insert: "Hello " },
      { insert: "world!", attributes: { highlight: "0" } },
      { insert: "\n" },
      { insert: "Hello", attributes: { highlight: "1" } },
      { insert: " world!\n"}
    ])

    this.focusField(this.state.focusedField)

    // expose quill to the browser console
    window.quill = this.quill
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focusedField !== this.state.focusedField) {
      this.focusField(this.state.focusedField)
    }
  }

  componentWillUnmount() {
    this.quill = null
    this.quillElement.remove()
    this.quillElement = null
  }

  focusField(field) {
    if (styles["focus-" + field] === undefined) {
      // TODO: implement some centralized error reporting
      alert(`ERROR: The field ${field} is not in the stylesheet. Update the @for loop bounds accordingly.`)
      return
    }

    const matches = (this.quillElement.getAttribute('class') || '')
      .split(/\s+/)
      .filter((name) => name.indexOf(styles["focus"] + "-") === 0)
    matches.forEach((name) => {
      this.quillElement.classList.remove(name)
    })
    
    this.quillElement.classList.add(styles["focus"] + "-" + field)
  }

  render() {
    return (
      <div className={styles["debug-container"]}>
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"></link>
  
        <div ref={el => this.containerElement = el}></div>
  
        <hr />
        <button onClick={() => {quill.enable(false)}}>Disable editing</button>
        <button onClick={() => {quill.enable(true)}}>Enable editing</button>
        <hr />
        {[...Array(5).keys()].map((x, i) =>
          <button
            key={i}
            disabled={this.state.focusedField == i.toString()}
            onClick={() => {this.setState({ focusedField: i.toString() })}}
          >Focus field {i}</button>
        )}
      </div>
    )
  }
}
