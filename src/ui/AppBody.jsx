import { useAtom } from "jotai"
import { AppMode } from "../state"
import { editorStore } from "../state"
import * as styles from "./AppBody.module.scss"
import { FormColumn } from "./form/FormColumn"
import { ReportColumn } from "./report/ReportColumn"

export function AppBody(props) {
  const {
    isOpen,
  } = props

  const [appMode] = useAtom(editorStore.appModeAtom)
  const isFormOpen = (appMode === AppMode.ANNOTATE_HIGHLIGHTS)
  
  return (
    <div className={styles["app-body"] + " " + (isOpen ? "" : styles["app-body--closed"])}>
      <div className={styles["report"]}>
        
        <ReportColumn />

      </div>
      <div className={styles["form"] + " " + (isFormOpen ? "" : styles["form--closed"])}>

        <FormColumn />
        
      </div>
    </div>
  )
}