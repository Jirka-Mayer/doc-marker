import { useCallback, useRef, useState } from "react"

/**
 * Stores the control value when it becomes null
 */
export function useNullabilityMiddleware(options) {

  // === public end of the middleware ===

  const {
    publicValue,
    publicHandleChange,
    path,
    isNullable
  } = options

  // non-nullable middleware bypass
  if (!isNullable) {
    return {
      privateValue: publicValue,
      privateHandleChange: publicHandleChange,
      isNull: publicValue === null,
      setNull: () => {}
    }
  }

  // makes sure we won't store null in cache
  // (this would make the field get stuck in the null position)
  function sanitizeCacheValue(v) {
    if (v === null)
      return undefined
    return v
  }

  const setPublicValue = useCallback((v) => {
    publicHandleChange(path, v)
  }, [publicHandleChange, path])


  // === middleware logic ===

  const isNull = publicValue === null

  // cache remembers the value when null
  const cache = useRef(sanitizeCacheValue(publicValue))

  // keep cache synced with the public value when not null
  // (public value changes with external updates but also with internal)
  if (!isNull && publicValue !== cache.current) {
    cache.current = sanitizeCacheValue(publicValue)
  }

  let privateValue = isNull ? cache.current : publicValue

  const setPrivateValue = useCallback((v) => {
    if (isNull) {
      // keep cache synced with the private value when null
      cache.current = sanitizeCacheValue(v)
    } else {
      setPublicValue(v) // propagate to public value when not null
    }
  }, [isNull, setPublicValue])

  const setNull = useCallback((v) => {
    if (v) {
      // cache value & set null
      cache.current = sanitizeCacheValue(publicValue)
      setPublicValue(null)
    } else {
      // restore value
      setPublicValue(cache.current)
    }
  }, [publicValue, setPublicValue])


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
    privateHandleChange,
    isNull,
    setNull
  }
}