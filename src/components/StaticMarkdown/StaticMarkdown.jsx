import React, { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { P, H1, H2, H3, H4, H5, H6, Link } from "pi-ui";
import styles from "./StaticMarkdown.module.css";
import { useStaticContent } from "src/containers/StaticContent";

const paragraphRenderer = ({ children }) => <P>{children}</P>;

const headingRenderer = ({ level, children }) => {
  const headings = [H1, H2, H3, H4, H5, H6];
  const Heading = headings[level - 1] || H4;
  return (
    <Heading
      style={{ marginBottom: "1.7rem" }}
      className={styles.markdownHeadings}>
      {children}
    </Heading>
  );
};

const linkRenderer = ({ href, children }) => (
  <Link href={href} rel="nofollow noopener noreferrer" target="_blank">
    {children}
  </Link>
);

/*
    The StaticMarkdownRenderer is used to render trustable content in the website from
    static markdown files included in the project.
 */
const StaticMarkdown = ({ contentName }) => {
  const [source, setSource] = useState("");
  const { getContent } = useStaticContent();
  useEffect(() => {
    async function fetchSource() {
      try {
        const content = await getContent(contentName);
        setSource(content);
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
    if (!source) {
      fetchSource();
    }
  }, [contentName, getContent, source]);

  const components = useMemo(
    () => ({
      p: paragraphRenderer,
      h2: headingRenderer,
      a: linkRenderer
    }),
    []
  );

  return (
    <ReactMarkdown className="static-md" components={components}>
      {source}
    </ReactMarkdown>
  );
};

export default React.memo(StaticMarkdown);
