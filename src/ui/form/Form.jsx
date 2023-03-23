import { formRenderers, formCells } from "./formRenderersAndCells"
import { materialRenderers } from "@jsonforms/material-renderers"
import { JsonForms } from "@jsonforms/react"
import { DesigningControls } from "./DesigningControls"
import { useAtom } from "jotai"
import { useCallback, useEffect, useState } from "react"
import { FormDefinition } from "../../../forms/FormDefinition"
import * as formStore from "../../state/formStore"
import * as userPreferencesStore from "../../state/userPreferencesStore"
import { useTranslation } from "react-i18next"
import { CircularProgress } from "@mui/material"

export function Form() {
  const [isLoading, setLoading] = useState(false)

  const [formId] = useAtom(formStore.formIdAtom)
  const [dataSchema, setDataSchema] = useState({})
  const [uiSchema, setUiSchema] = useState({})

  const [formErrors, setFormErrors] = useAtom(formStore.formErrorsAtom)
  const [formData, setFormData] = useAtom(formStore.formDataAtom)
  const [fieldStates] = useAtom(formStore.allFieldStatesAtom)
  const [displayDebugInfo] = useAtom(userPreferencesStore.displayDebugInfoAtom)

  const { i18n } = useTranslation()


  // === Reloading ===

  useEffect(() => {
    if (formId === null) {
      setDataSchema({})
      setUiSchema({})
      setLoading(false)
      return
    }
    
    // the asynchronous form reload
    setLoading(true);
    (async function() {
      const form = await FormDefinition.load(formId)
      await form.loadTranslation(i18n)
      
      setDataSchema(form.dataSchema)
      setUiSchema(form.uiSchema)
      setLoading(false)
    })();
  }, [formId, i18n.language]) // reload on form or language change


  // === Translation ===

  const translate = useCallback((key, defaultValue, context) => {
    // no translations while still loading
    if (isLoading)
      return undefined

    // try the form-specific namespace
    const contentKey = FormDefinition.I18NEXT_FORM_SPECIFIC_NS + ":" + key
    if (i18n.exists(contentKey))
      return i18n.t(contentKey, context)

    // try the app-global namesapce
    const controlsKey = FormDefinition.I18NEXT_FORM_GLOBAL_NS + ":" + key
    if (i18n.exists(controlsKey))
      return i18n.t(controlsKey, context)

    // no translation - use the default
    return defaultValue
  }, [formId, i18n.language, isLoading]) // re-translate when these change


  // === Rendering ===

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px"
      }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div>
      { formId === null ? null : (
        <JsonForms
          schema={dataSchema}
          uischema={uiSchema}
          data={formData}
          renderers={formRenderers}
          // renderers={materialRenderers}
          cells={formCells}
          onChange={({ data, errors }) => {
            setFormData(data)
            setFormErrors(errors)
          }}
          i18n={{
            locale: i18n.language,
            translate: translate
          }}
        />
      )}

      { displayDebugInfo ? <>
        <pre>FormID: { JSON.stringify(formId, null, 2) }</pre>
        <pre>Data: { JSON.stringify(formData, null, 2) }</pre>
        <pre>States: { JSON.stringify(fieldStates, null, 2) }</pre>
        <pre>Errors: { JSON.stringify(formErrors, null, 2) }</pre>
      </> : null}

      <DesigningControls />

    </div>
  )
}