import { currentOptions, setOptions } from "./options"
import { bootstrapLocalization } from "./i18n"
import { createRoot } from "react-dom/client"
import * as styles from "./ui/Application.module.scss"

/**
 * Creates the entire DocMarker application from the given options object.
 */
export async function bootstrapDocMarker(givenOptions) {
  setOptions(givenOptions)

  if (!givenOptions.element) {
    throw new Error("Missing `element` in the options object.")
  }
  
  // localization
  await bootstrapLocalization()

  // APIs
  await import("./importApis")
  
  // defered import so that options are already set when the application is imported
  const { Application } = await import("./ui/Application")

  // create and bind the application
  const root = createRoot(currentOptions.element)
  root.render(<Application />)
  currentOptions.element.classList.add(styles["application"])
}