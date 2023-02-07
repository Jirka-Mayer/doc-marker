import * as styles from "./AppBody.module.scss"
import { FormColumn } from "./form/FormColumn"
import { ReportColumn } from "./report/ReportColumn"

export function AppBody(props) {
  const {
    isOpen,
  } = props
  
  return (
    <div className={styles["app-body"] + " " + (isOpen ? "" : styles["app-body--closed"])}>
      <div className={styles["report"]}>
        
        <ReportColumn />

      </div>
      <div className={styles["form"]}>

        <FormColumn />
        
      </div>
    </div>
  )
}