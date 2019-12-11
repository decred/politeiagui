import { useState, useCallback } from "react";

export default function useHighlightedItem(initialItem) {
  const [item, setItem] = useState(initialItem || null);
  const setHighlightedItem = useCallback(
    f => {
      setItem(f);
    },
    [setItem]
  );
  const removeHighlightedItem = useCallback(() => {
    setItem(null);
  }, [setItem]);
  return [item, setHighlightedItem, removeHighlightedItem];
}
