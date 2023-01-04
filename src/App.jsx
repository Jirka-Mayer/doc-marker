import * as styles from "./App.module.scss"

export function App() {
  return (
    <>
      <p>Hello world!</p>
      <button
        className={styles["my-button"]}
        onClick={() => alert("Hello!")}
      >Click me!</button>
    </>
  )
}