import { useEffect, useState } from "react"
import { QuillManager } from "./QuillManager";
import { useLazyRef } from "../core/useLazyRef"

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
    // TODO: compute new highlights?

    this.setContent(this.quillManager.getContents())
  }

  /**
   * Call this when you want to modify the state
   */
  dispatch(action) {
    if (action.type === "add") {
      // TODO: this is dummy, it should trigger quill change instead
      this.setHighlights({
        ...this.highlights,
        [action.highlight]: action.value
      })
    }
  }
}