import { useEffect } from "react";

const setHTMLTitle = title => (document.title = title);

export function useDocumentTitle(title) {
  title = title || "";
  useEffect(() => {
    setHTMLTitle(title);
    return () => setHTMLTitle("meeee");
  }, [title]);
}
