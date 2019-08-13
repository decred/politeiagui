import React, { useState } from "react";
import xssFilters from "xss-filters";
// import htmlParser from "react-markdown/plugins/html-parser";
import { compiler } from "markdown-to-jsx";
import ModalExternalLink from "../ModalExternalLink";

// export const htmlParserRules = htmlParser({
//   isValidNode: node => {
//     return node.type !== "script";
//   }
// });

const allowedTypes = [
  "a",
  "p",
  "br",
  "h5",
  "h2",
  "code",
  "pre",
  "h1",
  "h3",
  "h4",
  "h6",
  "em",
  "strong",
  "del",
  "li",
  "ul",
  "ol",
  "span",
  "img",
  "th",
  "tr",
  "thead",
  "td",
  "tbody",
  "table",
  "blockquote",
  "dt",
  "dd",
  "dl",
  "hr",
  "div"
];

const customTypes = ["a", "img"];

export const rawTextToMarkdown = rawText =>
  compiler(rawText, {
    // forceBlock: true,
    createElement: rootHandler(true)
  });

export const traverseChildren = (el, cb) => {
  const filterChildren = c =>
    React.Children.map(c, child => traverseChildren(child, cb));
  let newElement = null;
  if (el && el.children) {
    newElement = {
      ...el,
      children: filterChildren(el.children)
    };
  } else if (el && el.props && el.props.children) {
    const filteredChildren = filterChildren(el.props.children);
    newElement = {
      ...el,
      props: {
        ...el.props,
        children: filteredChildren
      }
    };
  }
  return newElement ? cb(newElement) : cb(el);
};

export const handleFilterXss = el => {
  if (typeof el === "string") return el;
  const props = el.props;
  if (!props) {
    return el;
  }
  const newProps = {
    ...props
  };
  if (newProps.src) {
    newProps.src = xssFilters.uriInDoubleQuotedAttr(props.src);
  }
  return {
    ...el,
    props: newProps
  };
};

const isExternalLink = link => {
  // e.preventDefault();
  // Does this to prevent xss attacks
  const tmpLink = document.createElement("a");
  tmpLink.href = link;
  const externalLink =
    tmpLink.hostname && tmpLink.hostname !== window.top.location.hostname;

  return externalLink;
};

const LinkRenderer = ({ url, children }) => {
  const [modalState, setModalState] = useState(false);
  function onLinkClick(e) {
    if (isExternalLink(url)) {
      e.preventDefault();
      setModalState(true);
    }
  }
  function onCloseModal() {
    setModalState(false);
  }
  return (
    <>
      <a href={url} onClick={onLinkClick}>
        {children}
      </a>
      <ModalExternalLink show={modalState} onClose={onCloseModal} link={url} />
    </>
  );
};

// const imageHandler = ({ src, alt }) => {
//   return <LinkRenderer url={src}>{alt}</LinkRenderer>;
// };

// const linkHandler = ({ href, children }) => {
//   return <LinkRenderer url={href}>{children}</LinkRenderer>;
// };

export const rootHandler = filterXss => (type, props, children) => {
  const isTypeForbidden = allowedTypes.indexOf(type) === -1;
  const isCustomType = customTypes.indexOf(type) !== -1;
  if (isTypeForbidden && !isCustomType) {
    return <></>;
  }
  if (isCustomType && props.href) {
    return (
      <LinkRenderer url={props.href} key={props.key}>
        {children}
      </LinkRenderer>
    );
  }
  if (isCustomType && props.src) {
    return (
      <LinkRenderer url={props.src} key={props.key}>
        {props.alt || ""}
      </LinkRenderer>
    );
  }
  let el = React.createElement(type, props, children);
  if (filterXss) {
    el = handleFilterXss(el);
  }
  return el;
};
// export const rootHandler = filterXss => el => {
//   if (filterXss) {
//     el = traverseChildren(el, handleFilterXss);
//   }
//   const { children, ...props } = el;
//   return <div {...props}>{children}</div>;
// };

// export const customRenderers = filterXss => {
//   const rootRenderer = rootHandler(filterXss);

//   return {
//     image: imageHandler,
//     imageReference: imageHandler,
//     link: linkHandler,
//     linkReference: linkHandler,
//     root: rootRenderer
//   };
// };
