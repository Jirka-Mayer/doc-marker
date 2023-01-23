import * as styles from "./FormColumn.module.scss"
import { Form } from "./Form"

export function FormColumn(props) {
  const {
    activeFieldId,
    setActiveFieldId,
    formData,
    setFormData,
  } = props

  return (
    <div className={styles["scroll-container"]}>
      <div className={styles["content"]}>
        
        <Form
          activeFieldId={activeFieldId}
          setActiveFieldId={fn => setActiveFieldId(fn)}
          formData={formData}
          setFormData={setFormData}
        />
        
      </div>
    </div>
  )
}