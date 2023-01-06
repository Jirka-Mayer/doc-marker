import { useRef } from "react"

const none = {}

/**
 * Custom hook that works like useRef, only with lazy initialization
 */
export function useLazyRef(init) {
  const ref = useRef(none)
  if (ref.current === none) {
    ref.current = init()
  }
  return ref
}