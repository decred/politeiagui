import { useEffect } from "react";
import { useConfig } from "src/containers/Config";

const setDocumentTitle = title => (document.title = title);

export function useDocumentTitle(title) {
  const { title: defaultTitle } = useConfig();
  const newTitle = title || defaultTitle;

  useEffect(() => {
    setDocumentTitle(newTitle);
  }, [newTitle]);
}
