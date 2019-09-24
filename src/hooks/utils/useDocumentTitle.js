import { useEffect } from "react";

const setHTMLTitle = title => (document.title = title);

export function useDocumentTitle(newTitle, originalTitle) {
  newTitle = newTitle || "";
  useEffect(() => {
    setHTMLTitle(newTitle);
    return () => setHTMLTitle(originalTitle);
  }, [newTitle]);
}
