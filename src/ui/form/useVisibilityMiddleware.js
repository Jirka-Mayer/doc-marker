import { useCallback, useEffect, useRef } from "react"
import { usePrevious } from "../../utils/usePrevious"

// the middleware can be in various states
const STATE_TRANSPARENT = 0 // is visible, passes values through
const STATE_PRETENDING = 1 // is hidden, displays fake value to the public

/**
 * Stores the control value when it becomes non visible and presents
 * the public with the value "undefined".
 */
export function useVisibilityMiddleware(options) {

  // === public end of the middleware ===

  const {
    publicValue,
    publicHandleChange,
    path,
    visible,
    publicValueWhenInvisible // defaults to undefined naturally
  } = options

  // console.log("[rec]", path, publicValue)
  const setPublicValue = useCallback((v) => {
    // console.log("[SET]", path, v)
    publicHandleChange(path, v)
  }, [publicHandleChange, path])


  // === middleware logic ===
  
  // cache for the public value when pretending
  const cache = useRef(publicValue)

  // is the middleware pretending or not?
  // const state = useRef(visible ? STATE_TRANSPARENT : STATE_PRETENDING)
  const state = useRef(STATE_TRANSPARENT)

  const startPretending = useCallback(() => {
    if (state.current === STATE_PRETENDING) {
      console.warn("Starting pretending, but already is", path)
      return
    }

    // console.log("START PRETEND", path, "Caching:", publicValue)

    state.current = STATE_PRETENDING // update state
    cache.current = publicValue // cache value
    setPublicValue(publicValueWhenInvisible) // set pretend public value
  }, [publicValue, setPublicValue, publicValueWhenInvisible])

  const stopPretending = useCallback(() => {
    if (state.current === STATE_TRANSPARENT) {
      console.warn("Stopping pretending, but already transparent", path)
      return
    }

    state.current = STATE_TRANSPARENT // update state

    // restore public value from cache
    // (but only if the current public value is the pretended value)
    // (because in such case, the form as a whole has been probably set)
    // console.log("(PVWI)", path, publicValueWhenInvisible)
    if (publicValue === publicValueWhenInvisible) {
      // console.log("STOP PRETEND", path, "Restoring:", cache.current)
      setPublicValue(cache.current)
    } else {
      // console.log("STOP PRETEND", path, "No restoration")
    }
  }, [publicValue, setPublicValue, publicValueWhenInvisible])

  useEffect(() => {
    // we should be pretending, when not visible
    if (!visible && state.current === STATE_TRANSPARENT) {
      startPretending()
    }
  
    // we should be transparent, when visible
    else if (visible && state.current === STATE_PRETENDING) {
      stopPretending()
    }

    // match the public value to the pretend value
    // (but only if not transitioning - see the "else" keywords!)
    else if (state.current === STATE_PRETENDING
      && publicValue !== publicValueWhenInvisible
    ) {
      setPublicValue(publicValueWhenInvisible)
      // console.log("VALUE ALIGNED", path, publicValueWhenInvisible)
    }
  }, [visible, startPretending, stopPretending, publicValue, publicValueWhenInvisible])

  const privateValue = (state.current === STATE_TRANSPARENT)
    ? publicValue
    : cache.current

  const setPrivateValue = useCallback((v) => {
    if (state.current === STATE_TRANSPARENT) {
      // pass through
      setPublicValue(v)
    }
    
    if (state.current === STATE_PRETENDING) {
      // keep cache synced with the private value when pretending
      cache.current = v
      // console.log("SET CACHE INVISIBLE", path, cache.current)
    }
  }, [setPublicValue])


  // === private end of the middleware ===

  const privateHandleChange = useCallback((p, v) => {
    if (p === path) {
      setPrivateValue(v)
    } else {
      publicHandleChange(p, v)
    }
  }, [setPrivateValue, publicHandleChange])

  return {
    privateValue,
    privateHandleChange
  }
}