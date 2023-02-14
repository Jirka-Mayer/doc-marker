import * as styles from "./Application.module.scss"
import { AppBar } from "./AppBar"
import { WelcomeBody } from "./WelcomeBody"
import { StatusBar } from "./StatusBar"
import { AppBody } from "./AppBody"
import JotaiNexus from "../utils/JotaiNexus"
import { useAtom } from "jotai"
import { isFileOpenAtom, openFileAtom, downloadFileAtom } from "../state/fileStore"

export function Application() {
  const [isFileOpen] = useAtom(isFileOpenAtom)

  // TODO: move it out of here
  const [,openFile] = useAtom(openFileAtom)

  return (
    <>
      <JotaiNexus />
      <div className={styles["app-bar-container"]}>
        
        <AppBar />
        
      </div>
      <div className={styles["app-body-container"]}>
        
        <WelcomeBody isOpen={!isFileOpen}
          applicationOpenFile={openFile} // TODO: move it out of here
        />

        <AppBody isOpen={isFileOpen} />

      </div>
      {/* <div className={styles["status-bar-container"]}>

        <StatusBar />

      </div> */}
    </>
  )
}