/*
Just like JSON Forms debounce:
  @jsonforms/material-renderers/src/util/debounce

But with the difference, that modifying data externally cancels
any pending writes. This lets "undo" functionality set the form state
without being shortly after overwritten by this local debouncing.
*/

import debounce from 'lodash/debounce'
import { useState, useCallback, useEffect } from 'react'


const eventToValue = (e) => e.target.value

export function useDebouncedChange(
  handleChange,
  defaultValue,
  data,
  path,
  eventToValueFunction = eventToValue,
  timeout = 300
) {
  const [input, setInput] = useState(data ?? defaultValue)
  
  const debouncedUpdate = useCallback(
    debounce((newValue) => handleChange(path, newValue), timeout),
    [handleChange, path, timeout]
  )

  useEffect(() => {
    setInput(data ?? defaultValue)

    // here is the additional canceling
    debouncedUpdate.cancel()
  }, [data])

  const onChange = useCallback((e) => {
    const newValue = eventToValueFunction(e)
    setInput(newValue ?? defaultValue)
    debouncedUpdate(newValue)
  }, [debouncedUpdate, eventToValueFunction])

  const onClear = useCallback(() => {
    setInput(defaultValue)
    handleChange(path, undefined)
  }, [defaultValue, handleChange, path])

  return [input, onChange, onClear]
}