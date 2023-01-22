import * as styles from "./AppBody.module.scss"
import { FormColumn } from "../form/FormColumn"
import { ReportColumn } from "../report/ReportColumn"

export function AppBody(props) {
  const {
    isOpen,

    quillManager,
    appMode,
    activeFieldId,
    setActiveFieldId,
    highlights,
    content,
    formData,
    setFormData,
    reportStoreDispatch
  } = props
  
  return (
    <div className={styles["app-body"] + " " + (isOpen ? "" : styles["app-body--closed"])}>
      <div className={styles["report"]}>
        
        <ReportColumn
          quillManager={quillManager}
          appMode={appMode}
          activeFieldId={activeFieldId}
          highlights={highlights}
          content={content}
        />

      </div>
      <div className={styles["form"]}>

        <FormColumn
          activeFieldId={activeFieldId}
          setActiveFieldId={setActiveFieldId}
          formData={formData}
          setFormData={setFormData}
          highlights={highlights}
          reportStoreDispatch={reportStoreDispatch}
        />
        
      </div>
    </div>
  )
}