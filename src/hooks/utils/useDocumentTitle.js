import { useEffect } from "react";
import { useConfig } from "src/Config";

const setDocumentTitle = title => (document.title = title);

export function useDocumentTitle(title) {
  console.log("here", title);
  const { title: defaultTitle } = useConfig();
  const newTitle = title || defaultTitle;

  useEffect(() => {
    setDocumentTitle(newTitle);
  }, [newTitle]);
}
