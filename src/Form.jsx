import * as styles from "./Form.module.scss"
import { Field } from "./Field"

export function Form({ onActivate }) {
  return (
    <div className={styles["debug-container"]}>
      <Field title="Person name" fieldName="0" onActivate={onActivate} />
      <Field title="Age" fieldName="1" onActivate={onActivate} />
    </div>
  )
}