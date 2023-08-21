import * as styles from "./Application.module.scss"
import { AppBar } from "./AppBar"
import { WelcomeBody } from "./WelcomeBody"
import { StatusBar } from "./StatusBar"
import { AppBody } from "./AppBody"
import JotaiNexus from "../utils/JotaiNexus"
import { useAtom } from "jotai"
import * as fileStore from "../state/fileStore"
import { ResqExportDialog } from "./dialogs/ResqExportDialog"
import { ChangeLocaleDialog } from "./dialogs/ChangeLocaleDialog"
import useUnload from "../utils/useUnload"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { currentOptions } from "../options"
import { CreateFileDialog } from "./dialogs/CreateFileDialog"

const theme = createTheme(currentOptions.theme)

export function Application() {
  const [isFileOpen] = useAtom(fileStore.isFileOpenAtom)

  // close te file when closing the browser
  // (this may trigger saving if the file is dirty)
  useUnload(e => {
    if (isFileOpen) {
      fileStore.closeFile()
    }
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <JotaiNexus />
        <div className={styles["app-bar-container"]}>
          
          <AppBar />
          
        </div>
        <div className={styles["app-body-container"]}>
          
          <WelcomeBody isOpen={!isFileOpen} />

          <AppBody isOpen={isFileOpen} />

        </div>
        <div className={styles["status-bar-container"]}>

          <StatusBar />

        </div>

        <ResqExportDialog />
        <ChangeLocaleDialog />
        <CreateFileDialog />
      </ThemeProvider>
    </>
  )
}