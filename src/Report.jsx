import React from "react"
import Quill from "quill"
import * as styles from "./Report.module.scss"
import { highlightAttributorFactory } from "./highlightAttributorFactory"
import { AppMode } from "./AppMode"

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

    this.state = {}

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

    this.renderAppMode()
    this.renderFieldActivity()

    this.quill.on("selection-change", this.onSelectionChange)

    // expose quill to the browser console
    window.quill = this.quill
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.mode !== this.props.mode)
      this.renderAppMode()
    
    if (prevProps.activeFieldName !== this.props.activeFieldName)
      this.renderFieldActivity()
  }

  componentWillUnmount() {
    this.quill.off("selection-change", this.onSelectionChange)
    
    this.quill = null
    this.quillElement.remove()
    this.quillElement = null
  }

  onSelectionChange(range, oldRange, source) {
    // TODO: when the mode is "annotations", handle clicks and drags
  }

  renderAppMode() {
    if (this.props.mode === AppMode.EDIT_TEXT) {
      this.quill.enable(true)
    }

    if (this.props.mode === AppMode.ANNOTATE_HIGHLIGHTS) {
      this.quill.enable(false)
    }
  }

  renderFieldActivity() {
    const activeFieldName = this.props.activeFieldName

    // remove all activity css classes
    const classNames = this.quillElement.getAttribute('class') || ''
    classNames
      .split(/\s+/)
      .filter((name) => name.indexOf(styles["active"] + "-") === 0)
      .forEach((name) => {
        this.quillElement.classList.remove(name)
      })

    // no field is active
    if (activeFieldName === null)
      return

    // check the activity class exists
    if (styles["active-" + activeFieldName] === undefined) {
      console.error(`The field ${activeFieldName} is not in the ` +
        `stylesheet. Update the style sheet accordingly.`)
    }
    
    // add the proper activity css class
    this.quillElement.classList.add(styles["active"] + "-" + activeFieldName)
  }

  render() {
    return (
      <div className={styles["debug-container"]}>
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"></link>

        <pre>Mode: {this.props.mode}</pre>
        <pre>Active field name: {JSON.stringify(this.props.activeFieldName)}</pre>
  
        <div ref={el => this.containerElement = el}></div>
      </div>
    )
  }
}
