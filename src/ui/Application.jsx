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

export function Application() {
  const [isFileOpen] = useAtom(fileStore.isFileOpenAtom)

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