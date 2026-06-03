import { JsonForms } from "@jsonforms/react";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Form } from "../../../forms/Form";
import { useTranslation } from "react-i18next";
import { CircularProgress, Typography } from "@mui/material";
import { usePreventScrollOverNumberFields } from "./usePreventScrollOverNumberFields";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import {
  createAjv,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  UISchemaElement,
} from "@jsonforms/core";
import { extractFormDataHierarchy } from "./extractFormDataHierarchy";
import { DocMarkerContext } from "../DocMarkerContext";
import { JsonSchema } from "@jsonforms/core";
import { FormData, FormErrors } from "../../state/FormStore";

/**
 * Converts AJV errors to string representation for debug printing
 */
const stringifyErrors = (errors: any, tabWidth: number) =>
  JSON.stringify(
    errors,
    [
      "instancePath",
      "schemaPath",
      "keyword",
      "params",
      "message",
      // "schema", "parentSchema", "data"
    ],
    tabWidth,
  );

export function FormComponent() {
  const {
    dmOptions,
    fieldsRepository,
    historyStore,
    formsRepository,
    localesRepository,
    editorStore,
    formStore,
  } = useContext(DocMarkerContext);

  const [isLoading, setLoading] = useState<boolean>(false);

  const formId = useAtomValue(formStore.formIdAtom);
  const [dataSchema, setDataSchema] = useState<JsonSchema>({});
  const [uiSchema, setUiSchema] = useState<UISchemaElement | undefined>(
    undefined,
  );
  const [formRenderers, setFormRenderers] = useState<
    JsonFormsRendererRegistryEntry[]
  >([]);
  const [formCells, setFormCells] = useState<
    JsonFormsCellRendererRegistryEntry[]
  >([]);

  const reloadTrigger = useAtomValue(formStore.internal.formReloadTriggerAtom);
  const [formRenderingData, setFormRenderingData] = useAtom(
    formStore.internal.formDataRenderingAtom,
  );
  const [formExternalData, setFormExternalData] = useAtom(
    formStore.formDataAtom,
  );

  const [exportedData, setExportedData] = useState<FormData>({});
  const [exportedErrors, setExportedErrors] = useState<FormErrors>(undefined);
  const ajvValidator = useMemo(
    () => createAjv().compile(dataSchema),
    [dataSchema],
  );

  const displayDebugInfo = useAtomValue(editorStore.displayDebugInfoAtom);

  const { i18n } = useTranslation();

  usePreventScrollOverNumberFields();

  // === Reloading ===

  useEffect(() => {
    if (formId === null) {
      setDataSchema({});
      setUiSchema(undefined);
      setLoading(false);
      return;
    }

    // the asynchronous form reload
    setLoading(true);
    setTimeout(async function () {
      // load form definition
      const form = await formsRepository.loadForm(formId);
      await form.loadTranslation(i18n, localesRepository.fallbackLocaleId);
      setDataSchema(form.dataSchema);
      setUiSchema(form.uiSchema);

      // if the file has just been created empty,
      // initialize the form data object hierarchy
      if (!formExternalData) {
        const emptyHierarchy = extractFormDataHierarchy(form.dataSchema);
        setFormExternalData(emptyHierarchy);
        historyStore.clear(); // the setting creates an update,
        // but since we just created the file
        // we can clear the history stack
      }

      // load renderers and cells
      setFormRenderers(await dmOptions.formRenderersImporter());
      setFormCells(await dmOptions.formCellsImporter());

      // done
      setLoading(false);
    }, 100); // delay so that the spinner has time to appear
  }, [formId, i18n.language, reloadTrigger]); // reload on form, language, or trigger change

  // === Translation ===

  const translate = useCallback(
    (key, defaultValue, context) => {
      // no translations while still loading
      if (isLoading) return undefined;

      // try the form-specific namespace
      const contentKey = Form.I18NEXT_FORM_SPECIFIC_NS + ":" + key;
      if (i18n.exists(contentKey)) return i18n.t(contentKey, context);

      // try the app-global namesapce
      const controlsKey = Form.I18NEXT_FORM_GLOBAL_NS + ":" + key;
      if (i18n.exists(controlsKey)) return i18n.t(controlsKey, context);

      // no translation - use the default
      return defaultValue;
    },
    [formId, i18n.language, isLoading],
  ); // re-translate when these change

  // === Rendering ===

  const { t } = useTranslation("formGlobal");

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      {formId === null ? null : (
        <JsonForms
          schema={dataSchema}
          uischema={uiSchema}
          data={formRenderingData}
          renderers={formRenderers}
          cells={formCells}
          onChange={({ data, errors }) => {
            setFormRenderingData(data);
            formStore.internal.setFormErrors(errors);

            // exported data and errors
            const _exportedData = fieldsRepository.getExportedFormData();
            ajvValidator(_exportedData);
            const _exportedErrors = ajvValidator.errors;
            setExportedData(_exportedData);
            setExportedErrors(_exportedErrors || undefined);
          }}
          i18n={{
            locale: i18n.language,
            translate: translate,
          }}
        />
      )}

      {/* Form footer */}
      <div
        style={{
          margin: "128px auto 256px auto",
          color: "rgba(0, 0, 0, 0.3)",
          textAlign: "center",
        }}
      >
        <LocalFloristIcon sx={{ fontSize: 48 }} />
        <Typography variant="body1">{t("thankYouMessage")}</Typography>
      </div>

      {displayDebugInfo ? (
        <>
          <pre>FormID: {JSON.stringify(formId, null, 2)}</pre>
          <pre>Exported data: {JSON.stringify(exportedData, null, 2)}</pre>
          {/* <pre>Form data: { JSON.stringify(formRenderingData, null, 2) }</pre>
        <pre>Form errors: { stringifyErrors(formErrors, 2) }</pre> */}
          <pre>Exported errors: {stringifyErrors(exportedErrors, 2)}</pre>
        </>
      ) : null}
    </div>
  );
}
