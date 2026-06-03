import { useRef, useEffect } from "react";

// Inspired by:
// https://stackoverflow.com/questions/39094138/reactjs-event-listener-beforeunload-added-but-not-removed

export type BeforeUnloadEventListener = (
  this: Window,
  ev: BeforeUnloadEvent,
) => any;

/**
 * Registers a listener function to be called when the browser window is closing
 */
export function useUnload(listener: BeforeUnloadEventListener) {
  const listenerRef = useRef<BeforeUnloadEventListener>(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    const onUnload: BeforeUnloadEventListener = (ev) =>
      listenerRef.current?.bind(window)?.(ev);

    window.addEventListener("beforeunload", onUnload);

    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);
}
