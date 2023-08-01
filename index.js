import { defaultOptions, currentOptions, setOptions } from "./src/options"
import { createRoot } from "react-dom/client"
import * as styles from "./src/ui/Application.module.scss"
import { bootstrapLocalization } from "./src/i18n"

export const defaultOptions = defaultOptions

export const currentOptions = currentOptions

export async function bootstrapDocMarker(givenOptions) {
  setOptions(givenOptions)

  if (!givenOptions.element) {
    throw new Error("Missing `element` in the options object.")
  }
  
  // localization
  await bootstrapLocalization()
  
  // defered import so that options are already set when the application is imported
  const { Application } = await import("./src/ui/Application")

  // create and bind the application
  const root = createRoot(currentOptions.element)
  root.render(<Application />)
  currentOptions.element.classList.add(styles["application"])
}
