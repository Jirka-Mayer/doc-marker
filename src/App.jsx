import * as styles from "./App.module.scss"
import { Report } from "./Report"

export function App() {
  return (
    <>
      <p>Hello world!</p>
      <button
        className={styles["my-button"]}
        onClick={() => alert("Hello!")}
      >Click me!</button>
      <Report />
    </>
  )
}