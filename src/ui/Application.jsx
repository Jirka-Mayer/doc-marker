import * as styles from "./Application.module.scss"
import { AppBar } from "./AppBar"
import { WelcomeBody } from "./WelcomeBody"
import { StatusBar } from "./StatusBar"
import { AppBody } from "./AppBody"
import { useAtom } from "jotai"
import { ChangeLocaleDialog } from "./dialogs/ChangeLocaleDialog"
import useUnload from "../utils/useUnload"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { currentOptions } from "../options"
import { CreateFileDialog } from "./dialogs/CreateFileDialog"
import { DocMarkerContext, useDocMarkerContextState } from "./DocMarkerContext"

const theme = createTheme(currentOptions.theme)

export function Application() {
  const docMarkerContext = useDocMarkerContextState()

  const { fileMetadataStore, fileStateManager } = docMarkerContext;

  const [isFileOpen] = useAtom(fileMetadataStore.isFileOpenAtom)

  // close te file when closing the browser
  // (this may trigger saving if the file is dirty)
  useUnload(e => {
    if (isFileOpen) {
      fileStateManager.closeFile()
    }
  });

  return (
    <DocMarkerContext.Provider value={docMarkerContext}>
      <ThemeProvider theme={theme}>
        <div className={styles["app-bar-container"]}>
          
          <AppBar />
          
        </div>
        <div className={styles["app-body-container"]}>
          
          <WelcomeBody isOpen={!isFileOpen} />

          <AppBody isOpen={isFileOpen} />

        </div>
        <div className={styles["status-bar-container"]}>

          {/* Currently only used for debugging: Press Ctrl+F12 to see it */}
          <StatusBar />

        </div>

        <ChangeLocaleDialog />
        <CreateFileDialog />
        { currentOptions.slots.dialogs }
      </ThemeProvider>
    </DocMarkerContext.Provider>
  )
}