import { useEffect } from "react";
import { useConfig } from "src/Config";

const setDocumentTitle = title => (document.title = title);

export function useDocumentTitle(title) {
  console.log("here", title);
  const { title: defaultTitle } = useConfig();
  const newTitle = title || defaultTitle;

  useEffect(() => {
    console.log("CHANGE", newTitle);
    setDocumentTitle(newTitle);
  }, [newTitle]);
}
