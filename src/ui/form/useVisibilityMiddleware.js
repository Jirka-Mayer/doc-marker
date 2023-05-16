import { useCallback, useEffect, useRef } from "react"
import { usePrevious } from "../../utils/usePrevious"

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
    visible
  } = options

  const setPublicValue = useCallback((v) => {
    publicHandleChange(path, v)
  }, [publicHandleChange, path])


  // === middleware logic ===
  
  // tracking visibility changes
  const previousVisible = usePrevious(visible, visible)
  const justBecameVisible = visible && !previousVisible
  const justBecameInvisible = !visible && previousVisible
  const visibleForReal = visible && !justBecameVisible

  // cache remembers the value when not visible and pretending to be undefined
  const cache = useRef(publicValue)

  // keep cache synced with the public value when visible
  // (public value changes with external updates but also with internal)
  if (visibleForReal && publicValue !== cache.current) {
    cache.current = publicValue
  }

  let privateValue = visibleForReal ? publicValue : cache.current

  const setPrivateValue = useCallback((v) => {
    if (visible) {
      setPublicValue(v) // propagate to public value when visible
    } else {
      cache.current = v // keep cache synced with the private value when invisible
    }
  }, [visible, setPublicValue])

  useEffect(() => {
    // hide value
    if (justBecameInvisible) {
      setPublicValue(undefined)
    }

    // restore value
    if (justBecameVisible) {
      setPublicValue(cache.current)
    }
  })


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