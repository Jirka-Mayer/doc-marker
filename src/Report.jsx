import React from "react"
import Quill from "quill"
import * as styles from "./Report.module.scss"
import { AppMode } from "./AppMode"

// set of all of our CSS classes
const stylesActiveClassSet = new Set(
  Object.values(styles).filter(k => k.indexOf("active") !== -1)
)

// field names defined in the style sheet
const allowedFieldNames = Object.keys(styles)
  .filter(k => k.indexOf("active-") === 0)
  .map(k => k.substring("active-".length))
  .sort()

// register one attributor for each field name
//
// NOTE: The attributor needs to have some value,
// so we'll use "yes" as the only allowed value.
const Parchment = Quill.import("parchment")
for (let fieldName in allowedFieldNames) {
  let attributor = new Parchment.Attributor.Class(
    "highlight-" + fieldName,
    styles[`highlight-${fieldName}-yes`].slice(0, -4), // -4 for the "-yes" suffix
    {
      scope: Parchment.Scope.INLINE,
      whitelist: ["yes"] // allow only "yes" as the value
    }
  )
  Quill.register(attributor, true)
}

// NOTE: Class compomnents are better suited for integration with 3rd party
// libraries that manipulate DOM than functional components.
export class Report extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.containerElement = null
    this.quillElement = null
    this.selectionChangehandler = null
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
        ...allowedFieldNames.map(n => "highlight-" + n)
      ]
    })

    this.quill.setContents([
      { insert: "Hello " },
      { insert: "world!", attributes: { "highlight-0": "yes" } },
      { insert: "\n" },
      { insert: "Hello", attributes: { "highlight-1": "yes" } },
      { insert: " world!\n"}
    ])

    this.renderAppMode()
    this.renderFieldActivity()

    this.selectionChangehandler = this.onSelectionChange.bind(this)
    this.quill.on("selection-change", this.selectionChangehandler)

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
    this.quill.off("selection-change", this.selectionChangehandler)
    
    this.quill = null
    this.quillElement.remove()
    this.quillElement = null
  }

  onSelectionChange(range, oldRange, source) {
    if (this.props.mode === AppMode.ANNOTATE_HIGHLIGHTS && range) {
      if (range.length === 0)
        this.handleAnnotationClick(range.index)
      else
        this.handleAnnotationDrag(range.index, range.length)
    }
  }

  handleAnnotationClick(index) {
    if (this.props.activeFieldName === null)
      return

    // clicking after the end of line does nothing
    if (this.quill.getText(index, 1) == "\n")
      return

    // clicking before the start of line does nothing
    if (this.quill.getText(index - 1, 1) == "\n")
      return

    // clicking before the start of text does nothing
    if (index == 0)
      return

    // delete the entire region
    let fieldName = this.props.activeFieldName
    let from = this.followHighlightLeft(fieldName, index)
    let to = this.followHighlightRight(fieldName, index)

    // the click was not over any highlighted range
    if (from === to)
      return

    let formats = {}
    formats["highlight-" + fieldName] = ""
    this.quill.formatText(from, to - from, formats)
  }

  followHighlightRight(fieldName, startIndex) {
    let index = startIndex
    while (true) {
      if (this.quill.getText(index, 1) != "\n") {
        let format = this.quill.getFormat(index, 1)
        if (format["highlight-" + fieldName] !== "yes")
          break
      }
      index += 1
    }
    return index
  }

  followHighlightLeft(fieldName, startIndex) {
    let index = startIndex - 1
    while (true) {
      if (this.quill.getText(index, 1) != "\n") {
        let format = this.quill.getFormat(index, 1)
        if (format["highlight-" + fieldName] !== "yes")
          break
      }      
      index -= 1
    }
    return index + 1
  }

  handleAnnotationDrag(index, length) {
    if (this.props.activeFieldName === null)
      return
    
    // round the selection to words
    let from = this.getWordStartBefore(index)
    let to = this.getWordEndAfter(index + length)
    
    let formats = {}
    formats["highlight-" + this.props.activeFieldName] = "yes"
    this.quill.formatText(from, to - from, formats)

    // silent source ensures that it doesn't
    // trigger the click event above
    this.quill.setSelection(to, 0, "silent")
  }

  getWordStartBefore(index) {
    const WINDOW = 50
    const text = this.quill.getText(index - WINDOW, WINDOW)
    for (let i = text.length - 1; i >= 0; i--) {
      if (!this.isWordChar(text[i])) {
        return index - text.length + i + 1
      }
    }
    return index - text.length
  }

  getWordEndAfter(index) {
    const WINDOW = 50
    const text = this.quill.getText(index, WINDOW)
    for (let i = 0; i < text.length; i++) {
      if (!this.isWordChar(text[i])) {
        return index + i
      }
    }
    return index + text.length - 1
  }

  isWordChar(char) {
    if (char == " " || char == "\n" || char == "\t" || char == "\r")
      return false
    return true
  }

  renderAppMode() {
    if (this.props.mode === AppMode.EDIT_TEXT) {
      this.quill.enable(true)
      this.containerElement.classList.remove(styles["annotating-mode"])
    }

    if (this.props.mode === AppMode.ANNOTATE_HIGHLIGHTS) {
      this.quill.enable(false)
      this.containerElement.classList.add(styles["annotating-mode"])
    }
  }

  renderFieldActivity() {
    const activeFieldName = this.props.activeFieldName

    // remove all of our css classes
    Array.from(this.quillElement.classList.values())
      .filter(name => stylesActiveClassSet.has(name))
      .forEach(name => this.quillElement.classList.remove(name))

    // no field is active
    if (activeFieldName === null)
      return

    // check the activity class exists
    if (styles["active-" + activeFieldName] === undefined) {
      console.error(`The field ${activeFieldName} is not in the ` +
        `stylesheet. Update the style sheet accordingly.`)
    }
    
    // add the proper activity css class
    this.quillElement.classList.add(styles["active-" + activeFieldName])
  }

  render() {
    return (
      <div className={styles["debug-container"]}>
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"></link>

        <pre>Mode: {this.props.mode}</pre>
        <pre>Active field name: {JSON.stringify(this.props.activeFieldName)}</pre>
        <pre>Allowed field names: {JSON.stringify(allowedFieldNames)}</pre>
  
        <div ref={el => this.containerElement = el}></div>
      </div>
    )
  }
}
