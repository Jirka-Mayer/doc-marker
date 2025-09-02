import { atom, useAtom, getDefaultStore } from "jotai"
import _ from "lodash"
import { useEffect } from "react"
import { AtomGroup } from "../AtomGroup"

// lets us manipulate atoms from the non-jotai/react code
const jotaiStore = getDefaultStore()

/**
 * Event handlers to be implemented by the parent form store
 */
export const eventHandlers = {
  "formDataChanged": () => {}
}


///////////////
// Form data //
///////////////

/*
  JSON Forms keeps a copy of the form data inside. It has a reducer and it keeps
  its state. It watches the "data" we give to it via useEffect and updates its
  internal state when our provided data changes.
  https://github.com/eclipsesource/jsonforms/blob/master/packages/react/src/JsonFormsContext.tsx#L137

  This has a few unfortunate consequences and it prevents us from updating the
  data externally in a frequent manner. Also, JSON Forms calls onChange update
  even when the source of change is us, setting the data externally.

  Also for some reason, onChange is called with a 10ms latency and debounced,
  which furhter complicates driving the form data externally.

  For all these reasons I chose to separate the "modify internally" event
  from the "modify externally" event. I did that by separating the two APIs
  using two atoms: formData and formRenderingData, the latter being
  the internal API.

  We also keep track of data we have set via the external API and when it comes
  back to us via the onChange event, we ignore the event. This also helps
  breaking the unintended feedback loop.
*/

// the "initial" form data (read by JSON Forms)
const initialFormDataAtom = atom(null)

// the "actual" form data (written by JSON Forms)
const actualFormDataAtom = atom(null)

// tracking external writes to silence their onChange events
const externalWrites = new Set()
const writesTtl = []
const TTL_AGE_MS = 5 * 60 * 1000 // 5 minutes

function pruneWritesTtl() {
  const now = new Date()
  while (writesTtl.length > 0 && now - writesTtl[0].time > TTL_AGE_MS) {
    externalWrites.delete(writesTtl[0].value)
    writesTtl.shift()
  }
}

function addExternalWrite(value) {
  externalWrites.add(value)
  writesTtl.push({
    time: new Date(),
    value: value
  })
}

/**
 * This atom presents the internal API for form data, used by the form component.
 * Do not use this for reading/writing form data! Use the other atom instead.
 */
export const formDataRenderingAtom = atom(
  
  // used only when the JSON Forms component renders for the first time
  // and then is watched in useEffect for changes and triggers additional re-renders:
  // https://github.com/eclipsesource/jsonforms/blob/master/packages/react/src/JsonFormsContext.tsx#L137
  (get) => get(initialFormDataAtom),
  
  // triggered by JSON Forms "onChange" event
  (get, set, newValue) => {
    const oldValue = get(actualFormDataAtom)
    
    // setting this will present a new value of the form data to the rest
    // of the APP but will NOT cause JSON forms to re-render
    set(actualFormDataAtom, newValue)

    // silence changes caused by us
    // (their corresponding event has been emitted already)
    if (externalWrites.has(newValue)) {
      return
    }
    
    // trigger internal change event
    eventHandlers.formDataChanged({
      oldValue: oldValue,
      newValue: newValue,
      origin: "internal" // user used some form control
    })
  }
)

/**
 * This atom presents the external API for reading and writing form data
 */
export const formDataAtom = atom(
  (get) => get(actualFormDataAtom),
  (get, set, newValue) => {
    const oldValue = get(actualFormDataAtom)

    // setting this will present a new value of the form data to the rest
    // of the APP but will NOT cause JSON forms to re-render
    set(actualFormDataAtom, newValue)

    // this will trigger JSON Forms re-render with the new data
    // it will in cause onChange to be called and its event will be silenced
    set(initialFormDataAtom, newValue)
    
    // remember this external write value to silence the later onChange event
    addExternalWrite(newValue)
    pruneWritesTtl()

    // trigger external change event
    eventHandlers.formDataChanged({
      oldValue: oldValue,
      newValue: newValue,
      origin: "external" // someone set the form data programatically
    })
  }
)
