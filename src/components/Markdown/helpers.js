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

// Use external link renderer when images are not allowed
const imageHandler = (renderImages) => ({ src, alt }) => {
  return renderImages ? (
    <img src={src} alt={alt} />
  ) : (
    <LinkRenderer url={src}>{alt}</LinkRenderer>
  );
};

const linkHandler = ({ href, children }) => {
  return <LinkRenderer url={href}>{children}</LinkRenderer>;
};

const rootHandler = (el) => {
  const { children, ...props } = traverseChildren(el);
  return <div {...props}>{children}</div>;
};

export const customRenderers = (renderImages) => {
  return {
    image: imageHandler(renderImages),
    imageReference: imageHandler(renderImages),
    link: linkHandler,
    linkReference: linkHandler,
    root: rootHandler
  };
};
