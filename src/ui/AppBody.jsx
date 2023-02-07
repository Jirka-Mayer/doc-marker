import * as styles from "./AppBody.module.scss"
import { FormColumn } from "../form/FormColumn"
import { ReportColumn } from "../report/ReportColumn"

export function AppBody(props) {
  const {
    isOpen,

    appMode,
    activeFieldId,
    setActiveFieldId,
  } = props
  
  return (
    <div className={styles["app-body"] + " " + (isOpen ? "" : styles["app-body--closed"])}>
      <div className={styles["report"]}>
        
        <ReportColumn
          appMode={appMode}
          activeFieldId={activeFieldId}
        />

      </div>
      <div className={styles["form"]}>

        <FormColumn
          activeFieldId={activeFieldId}
          setActiveFieldId={setActiveFieldId}
        />
        
      </div>
    </div>
  )
}