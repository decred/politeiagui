import React from "react";
import xssFilters from "xss-filters";
import htmlParser from "react-markdown/plugins/html-parser";
import ModalExternalLink from "../ModalExternalLink";
import useModalContext from "src/hooks/utils/useModalContext";

export const htmlParserRules = htmlParser({
  isValidNode: (node) => {
    return node.type !== "script";
  }
});

export const traverseChildren = (el, cb) => {
  const filterChildren = (c) =>
    React.Children.map(c, (child) => traverseChildren(child, cb));
  let newElement = null;
  if (el.children) {
    newElement = {
      ...el,
      children: filterChildren(el.children)
    };
  } else if (el.props && el.props.children) {
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

export const handleFilterXss = (el) => {
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

const isExternalLink = (link) => {
  // e.preventDefault();
  // Does this to prevent xss attacks
  const tmpLink = document.createElement("a");
  tmpLink.href = link;
  const externalLink =
    tmpLink.hostname && tmpLink.hostname !== window.top.location.hostname;

  return externalLink;
};

const LinkRenderer = ({ url, children }) => {
  const [handleOpenModal, handleCloseModal] = useModalContext();

  function onLinkClick(e) {
    if (isExternalLink(url)) {
      e.preventDefault();
      handleOpenModal(ModalExternalLink, {
        onClose: handleCloseModal,
        link: url
      });
    }
  }
  return (
    <a href={url} onClick={onLinkClick}>
      {children}
    </a>
  );
};

const imageHandler = ({ src, alt }) => {
  return <LinkRenderer url={src}>{alt}</LinkRenderer>;
};

const linkHandler = ({ href, children }) => {
  return <LinkRenderer url={href}>{children}</LinkRenderer>;
};

const rootHandler = (filterXss) => (el) => {
  if (filterXss) {
    el = traverseChildren(el, handleFilterXss);
  }
  const { children, ...props } = el;
  return <div {...props}>{children}</div>;
};

export const customRenderers = (filterXss) => {
  const rootRenderer = rootHandler(filterXss);

  return {
    image: imageHandler,
    imageReference: imageHandler,
    link: linkHandler,
    linkReference: linkHandler,
    root: rootRenderer
  };
};
