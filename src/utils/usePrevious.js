import { useRef, useEffect } from "react"

/**
 * Returns the previous value of the given input value
 * (previous react-render value)
 */
export function usePrevious(value, initialValue) {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  },[value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}