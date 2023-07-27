import { createRoot } from "react-dom/client"
import { Application } from "./src/ui/Application"
import * as styles from "./src/ui/Application.module.scss"
import "./src/i18n"

export function bootstrapDocMarker(options) {
  if (!options.element) {
    throw new Error("Missing `element` in the options object.")
  }

  const root = createRoot(options.element)

  root.render(<Application />)
  
  options.element.classList.add(styles["application"])
}