import * as styles from "./App.module.scss"
import { Report } from "./Report"
import { useState } from "react"

export function App() {
  const [count, setCount] = useState(0)
  
  return (
    <>
      <p>Hello world {count}x!</p>
      <button
        className={styles["my-button"]}
        onClick={() => setCount(count + 1)}
      >Click me!</button>
      <Report />
    </>
  )
}