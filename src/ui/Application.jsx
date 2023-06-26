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

export function Application() {
  const [isFileOpen] = useAtom(fileStore.isFileOpenAtom)
  const [,closeFile] = useAtom(fileStore.closeFileAtom)

  // save current file when closing the browser window
  useUnload(e => {
    if (isFileOpen) {
      closeFile()
    }
  });

  return (
    <>
      <JotaiNexus />
      <div className={styles["app-bar-container"]}>
        
        <AppBar />
        
      </div>
      <div className={styles["app-body-container"]}>
        
        <WelcomeBody isOpen={!isFileOpen} />

        <AppBody isOpen={isFileOpen} />

      </div>
      {/* <div className={styles["status-bar-container"]}>

        <StatusBar />

      </div> */}

      <ResqExportDialog />
      <ChangeLocaleDialog />
    </>
  )
}