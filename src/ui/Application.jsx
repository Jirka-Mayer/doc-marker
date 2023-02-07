import * as styles from "./Application.module.scss"
import { AppBar } from "./AppBar"
import { WelcomeBody } from "./WelcomeBody"
import { StatusBar } from "./StatusBar"
import { AppBody } from "./AppBody"
import JotaiNexus from "../utils/JotaiNexus"
import { useAtom } from "jotai"
import { isFileOpenAtom, openFileAtom, downloadFileAtom } from "../state/fileStore"
import { activeFieldIdAtom, appModeAtom } from "../state/editorStore"

export function Application() {

  // TODO: move it out of here
  const [isFileOpen] = useAtom(isFileOpenAtom)

  // TODO: move it out of here
  const [mode, setMode] = useAtom(appModeAtom)
  const [activeFieldId, setActiveFieldId] = useAtom(activeFieldIdAtom)

  // TODO: move it out of here
  const [,openFile] = useAtom(openFileAtom)
  const [,downloadFile] = useAtom(downloadFileAtom)

  return (
    <>
      <JotaiNexus />
      <div className={styles["app-bar-container"]}>
        
        <AppBar
          mode={mode}
          setMode={setMode}
          downloadFile={downloadFile}
        />
        
      </div>
      <div className={styles["app-body-container"]}>
        
        <WelcomeBody
          isOpen={!isFileOpen}

          applicationOpenFile={openFile}
        />

        <AppBody
          isOpen={isFileOpen}

          appMode={mode}
          activeFieldId={activeFieldId}
          setActiveFieldId={setActiveFieldId}
        />

      </div>
      <div className={styles["status-bar-container"]}>

        <StatusBar />

      </div>
    </>
  )
}