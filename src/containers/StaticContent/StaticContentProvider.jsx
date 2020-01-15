import React, { createContext, useContext, useState, useCallback } from "react";

const staticContentContext = createContext();

export const useStaticContent = () => useContext(staticContentContext);

const StaticContentProvider = ({ children }) => {
  const [contents, setContents] = useState({});

  const getContent = useCallback(
    async contentName => {
      if (contents[contentName]) {
        return contents[contentName];
      }
      try {
        const module = await import(`src/assets/copies/${contentName}.md`);
        const markdownContent = await fetch(module.default);
        const text = await markdownContent.text();
        setContents({ ...contents, [contentName]: text });
        return text;
      } catch (e) {
        throw new Error(
          `Failed loading static content: ${contentName}. Error: ${e}`
        );
      }
    },
    [contents]
  );

  return (
    <staticContentContext.Provider value={{ getContent }}>
      {children}
    </staticContentContext.Provider>
  );
};

export default StaticContentProvider;
