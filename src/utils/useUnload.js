import { useRef, useEffect } from 'react'

// https://stackoverflow.com/questions/39094138/reactjs-event-listener-beforeunload-added-but-not-removed

// Registers a callback handler to be called when the browser window is closing
const useUnload = handler => {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const onUnload = (...args) => handlerRef.current?.(...args)

    window.addEventListener("beforeunload", onUnload)

    return () => window.removeEventListener("beforeunload", onUnload)
  }, [])
};

export default useUnload