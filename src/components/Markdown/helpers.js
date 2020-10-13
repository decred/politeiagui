import React from "react";
import htmlParser from "react-markdown/plugins/html-parser";
import ModalExternalLink from "../ModalExternalLink";
import useModalContext from "src/hooks/utils/useModalContext";

export const htmlParserRules = htmlParser({
  isValidNode: (node) => {
    return node.type !== "script";
  }
});

export const traverseChildren = (el) => {
  const filterChildren = (c) =>
    React.Children.map(c, (child) => traverseChildren(child));
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
  return newElement ? newElement : el;
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
  return <img src={src} alt={alt} />;
};

const linkHandler = ({ href, children }) => {
  return <LinkRenderer url={href}>{children}</LinkRenderer>;
};

const rootHandler = (filterXss) => (el) => {
  if (filterXss) {
    el = traverseChildren(el);
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
