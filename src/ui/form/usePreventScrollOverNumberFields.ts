import { useCallback, useEffect } from "react";

/**
 * Prevents scrolling number fields when mouse pointer is over
 * a number field and the user is just wanting to scroll the page
 */
export function usePreventScrollOverNumberFields(): void {
  const handler = useCallback((e: WheelEvent) => {
    if (document.activeElement === null) {
      return;
    }

    if (
      (document.activeElement as HTMLInputElement).type === "number" &&
      document.activeElement.classList.contains("noscroll")
    ) {
      (document.activeElement as HTMLInputElement).blur();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("wheel", handler);

    return () => {
      document.removeEventListener("wheel", handler);
    };
  });
}
