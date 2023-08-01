import { defaultOptions, currentOptions, setOptions } from "./src/options"
import { createRoot } from "react-dom/client"
import { Application } from "./src/ui/Application"
import * as styles from "./src/ui/Application.module.scss"
import "./src/i18n"

export const defaultOptions = defaultOptions

export const currentOptions = currentOptions

export function bootstrapDocMarker(givenOptions) {
  setOptions(givenOptions)

  if (!givenOptions.element) {
    throw new Error("Missing `element` in the options object.")
  }

  // create and bind the application
  const root = createRoot(currentOptions.element)
  root.render(<Application />)
  currentOptions.element.classList.add(styles["application"])
}
