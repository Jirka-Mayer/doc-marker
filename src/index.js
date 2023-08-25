import * as options from "./options"
import { createRoot } from "react-dom/client"
import * as styles from "./ui/Application.module.scss"
import { bootstrapLocalization } from "./i18n"

export const defaultOptions = options.defaultOptions

export const currentOptions = options.currentOptions

export async function bootstrapDocMarker(givenOptions) {
  options.setOptions(givenOptions)

  if (!givenOptions.element) {
    throw new Error("Missing `element` in the options object.")
  }
  
  // localization
  await bootstrapLocalization()
  
  // defered import so that options are already set when the application is imported
  const { Application } = await import("./ui/Application")

  // create and bind the application
  const root = createRoot(currentOptions.element)
  root.render(<Application />)
  currentOptions.element.classList.add(styles["application"])
}
