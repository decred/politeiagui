import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { P, H1, H2, H3, H4, Link } from "pi-ui";
import styles from "./StaticMarkdown.module.css";
import { useStaticContent } from "src/containers/StaticContent";

const paragraphRenderer = ({ children }) => <P>{children}</P>;

const headingRenderer = ({ level, children }) => {
  const headings = [H1, H2, H3, H4];
  // TODO: add h5 and h6 headings from pi-ui once it is available
  const Heading = headings[level - 1] || H4;
  return (
    <Heading
      style={{ marginBottom: "1.7rem" }}
      className={styles.markdownHeadings}
    >
      {children}
    </Heading>
  );
};

const linkRenderer = ({ href, children }) => (
  <Link href={href}>{children}</Link>
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
        throw e;
      }
    }
    if (!source) {
      fetchSource();
    }
  }, [contentName, getContent, source]);

  return (
    <ReactMarkdown
      escapeHtml={false}
      className="static-md"
      source={source}
      renderers={{
        paragraph: paragraphRenderer,
        heading: headingRenderer,
        link: linkRenderer
      }}
    />
  );
};

export default StaticMarkdown;
