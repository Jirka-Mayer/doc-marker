import { useCallback, useEffect } from "react";

export function usePreventScrollOverNumberFields() {
  const handler = useCallback((e) => {
    if (document.activeElement.type === "number"
      && document.activeElement.classList.contains("noscroll")
    ) {
      document.activeElement.blur()
    }
  })
  
  useEffect(() => {
    document.addEventListener("wheel", handler)

    return () => {
      document.removeEventListener("wheel", handler)
    }
  })
}