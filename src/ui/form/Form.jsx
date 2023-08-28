import { currentOptions } from "../../options"
import { JsonForms } from "@jsonforms/react"
import { useAtom } from "jotai"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FormDefinition } from "../../../forms/FormDefinition"
import * as formStore from "../../state/formStore"
import * as userPreferencesStore from "../../state/userPreferencesStore"
import * as historyStore from "../../state/historyStore"
import { useTranslation } from "react-i18next"
import { CircularProgress, Typography } from "@mui/material"
import { usePreventScrollOverNumberFields } from "./usePreventScrollOverNumberFields"
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { createAjv } from "@jsonforms/core"
import { extractFormDataHierarchy } from "./extractFormDataHierarchy"

export function Form() {
  const [isLoading, setLoading] = useState(false)

  const [formId] = useAtom(formStore.formIdAtom)
  const [dataSchema, setDataSchema] = useState({})
  const [uiSchema, setUiSchema] = useState({})
  const [formRenderers, setFormRenderers] = useState([])
  const [formCells, setFormCells] = useState([])

  const [reloadTrigger] = useAtom(formStore.formReloadTriggerAtom)
  const [formErrors, setFormErrors] = useAtom(formStore.formErrorsAtom)
  const [formRenderingData, setFormRenderingData] = useAtom(formStore.formDataRenderingAtom)
  const [formExternalData, setFormExternalData] = useAtom(formStore.formDataAtom)
  const [fieldStates] = useAtom(formStore.allFieldStatesAtom)
  const [displayDebugInfo] = useAtom(userPreferencesStore.displayDebugInfoAtom)

  const { i18n } = useTranslation()

  usePreventScrollOverNumberFields()


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
    setTimeout(async function() {
      
      // load form definition
      const form = await FormDefinition.load(formId)
      await form.loadTranslation(i18n)
      setDataSchema(form.dataSchema)
      setUiSchema(form.uiSchema)

      // if the file has just been created empty,
      // initialize the form data object hierarchy
      if (!formExternalData) {
        const emptyHierarchy = extractFormDataHierarchy(form.dataSchema)
        setFormExternalData(emptyHierarchy)
        historyStore.clear() // the setting creates an update,
                             // but since we just created the file
                             // we can clear the history stack
      }

      // load renderers and cells
      setFormRenderers(await currentOptions.formRenderersImporter())
      setFormCells(await currentOptions.formCellsImporter())

      // done
      setLoading(false)
      
    }, 100) // delay so that the spinner has time to appear
  }, [formId, i18n.language, reloadTrigger]) // reload on form, language, or trigger change


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

  const { t } = useTranslation("formGlobal")

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

  // const validate = createAjv().compile(dataSchema)
  // validate(formStore.getExportedFormData())
  // const myErrors = validate.errors

  return (
    <div>
      {/* <pre>My Errors: { JSON.stringify(myErrors, [
        "instancePath", "schemaPath", "keyword", "params", "message",
        // "schema", "parentSchema", "data"
      ], 2) }</pre> */}

      { formId === null ? null : (
        <JsonForms
          schema={dataSchema}
          uischema={uiSchema}
          data={formRenderingData}
          renderers={formRenderers}
          cells={formCells}
          onChange={({ data, errors }) => {
            setFormRenderingData(data)
            setFormErrors(errors)
          }}
          i18n={{
            locale: i18n.language,
            translate: translate
          }}
        />
      )}

      {/* Form footer */}
      <div style={{ margin: "128px auto 256px auto", color: "rgba(0, 0, 0, 0.3)", textAlign: "center" }}>
        <LocalFloristIcon sx={{ fontSize: 48 }} />
        <Typography variant="body1">
          { t("thankYouMessage") }
        </Typography>
      </div>

      { displayDebugInfo ? <>
        <pre>FormID: { JSON.stringify(formId, null, 2) }</pre>
        <pre>Exported data: { JSON.stringify(formStore.getExportedFormData(), null, 2) }</pre>
        <pre>Form data: { JSON.stringify(formRenderingData, null, 2) }</pre>
        <pre>States: { JSON.stringify(fieldStates, null, 2) }</pre>
        <pre>Errors: { JSON.stringify(formErrors, [
          "instancePath", "schemaPath", "keyword", "params", "message",
          // "schema", "parentSchema", "data"
        ], 2) }</pre>
      </> : null}

    </div>
  )
}