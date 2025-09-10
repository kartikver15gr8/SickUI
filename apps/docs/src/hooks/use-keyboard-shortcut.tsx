import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  modifier: "meta" | "ctrl" = "meta",
  callback: () => void
) {
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (
        (modifier === "meta" && e.metaKey && e.key.toLowerCase() === key) ||
        (modifier === "ctrl" && e.ctrlKey && e.key.toLowerCase() === key)
      ) {
        e.preventDefault();
        callback();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [key, modifier, callback]);
}
