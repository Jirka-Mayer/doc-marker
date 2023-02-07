import * as styles from "./FormColumn.module.scss"
import { Form } from "./Form"

export function FormColumn() {
  return (
    <div className={styles["scroll-container"]}>
      <div className={styles["content"]}>
        
        <Form />
        
      </div>
    </div>
  )
}