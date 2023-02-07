import { createRoot } from "react-dom/client"
import { Application } from "./ui/Application"

const container = document.getElementById("application")
const root = createRoot(container)
root.render(<Application />)
