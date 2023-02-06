import * as styles from "./Application.module.scss"
import { useState } from "react"
import { AppMode } from "./AppMode"
import { AppBar } from "./AppBar"
import { WelcomeBody } from "./WelcomeBody"
import { StatusBar } from "./StatusBar"
import { AppBody } from "./AppBody"
import JotaiNexus from "./JotaiNexus"
import { useAtom } from "jotai"
import { isFileOpenAtom, openFileAtom, downloadFileAtom } from "./appFileStore"

export function Application() {

  // TODO: move it out of here
  const [isFileOpen] = useAtom(isFileOpenAtom)

  // TODO: move into a store
  const [mode, setMode] = useState(AppMode.EDIT_TEXT)
  const [activeFieldId, setActiveFieldId] = useState(null)

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