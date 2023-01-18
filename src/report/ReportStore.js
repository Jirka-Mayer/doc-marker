import { useEffect, useState } from "react"
import { QuillManager } from "./QuillManager";
import { useLazyRef } from "../core/useLazyRef"
import { contentsToHighlights } from "./contentsToHighlights";

/**
 * Integrates the report store into react as a custom hook
 */
export function useReportStore() {
  const [highlights, setHighlights] = useState({})
  const [content, setContent] = useState({ ops: [] })
  
  const reportStoreRef = useLazyRef(() => new ReportStore())
  const reportStore = reportStoreRef.current;

  useEffect(() => {
    reportStore.update({
      highlights, setHighlights,
      content, setContent
    })
  })

  function reportStoreDispatch(action) {
    reportStore.dispatch(action)
  }

  return {
    quillManager: reportStore.quillManager,
    highlights,
    content,
    reportStoreDispatch
  }
}

/**
 * Contains and manipulates the state of the discharge report
 * and its field-highlights. It behaves similarly to react's reducers.
 * The quill editor instance also lives here and is passed down
 * to a react component that only atatches it to the DOM.
 */
export class ReportStore {
  constructor() {
    this.quillManager = new QuillManager(
      this.onTextChange.bind(this)
    )
    
    this.highlights = null
    this.setHighlights = null
    this.content = null
    this.setContent = null
  }

  /**
   * Reveives the latest hooks from the react wrapper
   */
  update({ highlights, setHighlights, content, setContent }) {
    this.highlights = highlights
    this.setHighlights = setHighlights
    this.content = content
    this.setContent = setContent
  }

  /**
   * Called by quill manager when the content of quill changes
   */
  onTextChange(delta) {
    let contents = this.quillManager.getContents()
    let highlights = contentsToHighlights(contents)
    
    this.setContent(contents)
    this.setHighlights(highlights)
  }

  /**
   * Call this when you want to modify the state
   */
  dispatch(action) {
    
    // set the content of the quill
    if (action.type === "setContents") {
      this.quillManager.setContents(action.delta)
    }

    // highlight a range for a field
    else if (action.type === "highlight") {
      this.quillManager.highlightText(
        action.range[0], action.range[1], action.fieldId
      )
    }

    // scroll highlight into view
    else if (action.type === "scrollHighlightIntoView") {
      this.quillManager.scrollHighlightIntoView(action.fieldId)
    }
  }
}