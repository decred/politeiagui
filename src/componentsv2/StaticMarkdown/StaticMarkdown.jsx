import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { P, H1, H2, H3, H4, Link } from "pi-ui";

const paragraphRenderer = ({ children }) => <P>{children}</P>;

const headingRenderer = ({ level, children }) => {
  const headings = [H1, H2, H3, H4];
  // TODO: add h5 and h6 headings from pi-ui once it is available
  const Heading = headings[level - 1] || H4;
  return <Heading style={{ marginBottom: "1.7rem" }}>{children}</Heading>;
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
  useEffect(() => {
    async function fetchSource() {
      try {
        const module = await import(`src/contents/${contentName}.md`);
        const markdownContent = await fetch(module.default);
        const text = await markdownContent.text();
        setSource(text);
      } catch (e) {
        console.log("Failed loading content:", contentName);
      }
    }
    fetchSource();
  }, []);
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
