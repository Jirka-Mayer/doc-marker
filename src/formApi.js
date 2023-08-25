import _ from "lodash"

import * as rendererStyles from "./ui/form/renderers/renderers.module.scss"

/**
 * API containing form utils for building custom form controls
 */
export let formApi = {
  rendererStyles
}

export async function importFormApi() {
  _.merge(formApi, {
    useDebounceChangeWithCancel: (await import("./ui/form/useDebounceChangeWithCancel")).useDebouncedChange,
    useFieldActivity: (await import("./ui/form/useFieldActivity")).useFieldActivity,
    useFieldHighlights: (await import("./ui/form/useFieldHighlights")).useFieldHighlights,
    useFieldState: (await import("./ui/form/useFieldState")).useFieldState,
    useHighlightPinButton: (await import("./ui/form/useHighlightPinButton")).useHighlightPinButton,
    useNullabilityMiddleware: (await import("./ui/form/useNullabilityMiddleware")).useNullabilityMiddleware,
    usePreventScrollOverNumberFields: (await import("./ui/form/usePreventScrollOverNumberFields")).usePreventScrollOverNumberFields,
    renderers: await import("./ui/form/renderers/index.js")
  })
}