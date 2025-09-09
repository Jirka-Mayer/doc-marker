import * as styles from "./FormColumn.module.scss"
import { FormComponent } from "./FormComponent"

export function FormColumn() {
  return (
    <div className={styles["scroll-container"]}>
      <div className={styles["content"]}>
        
        <FormComponent />
        
      </div>
    </div>
  )
}