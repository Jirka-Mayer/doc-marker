import * as styles from "./App.module.scss"
import { Report } from "./Report"
import { Form } from "./Form"
import { useState } from "react"
import { AppMode } from "./AppMode"

export function App() {
  const [count, setCount] = useState(0)

  const [mode, setMode] = useState(AppMode.ANNOTATE_HIGHLIGHTS)
  const [activeFieldName, setActiveFieldName] = useState(null)
  
  return (
    <>
      <p>Hello world {count}x!</p>
      <button
        className={styles["my-button"]}
        onClick={() => setCount(count + 1)}
      >Click me!</button>

      <hr />

      <button
        disabled={mode === AppMode.EDIT_TEXT}
        onClick={() => {setMode(AppMode.EDIT_TEXT)}}
      >Edit Text</button>
      <button
        disabled={mode === AppMode.ANNOTATE_HIGHLIGHTS}
        onClick={() => {setMode(AppMode.ANNOTATE_HIGHLIGHTS)}}
      >Annotate Highlights</button>

      <hr />

      <button
        disabled={activeFieldName === null}
        onClick={() => {setActiveFieldName(null)}}
      >Activate no field</button>
      {[...Array(5).keys()].map((x, i) =>
        <button
          key={i}
          disabled={activeFieldName == i.toString()}
          onClick={() => {setActiveFieldName(i.toString())}}
        >Activate field {i}</button>
      )}

      <Report mode={mode} activeFieldName={activeFieldName} />

      <Form onActivate={fn => setActiveFieldName(fn)} />
    </>
  )
}