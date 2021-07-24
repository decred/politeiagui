import React from "react";
import ModalExternalLink from "../ModalExternalLink";
import useModalContext from "src/hooks/utils/useModalContext";
import xssFilters from "xss-filters";

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

const handleFilterXss = (el) => {
  if (typeof el === "string") return el;
  const props = el.props;
  if (!props) {
    return el;
  }
  const newProps = {
    ...props
  };
  if (newProps.url) {
    newProps.url = xssFilters.uriInDoubleQuotedAttr(props.url);
  }
  if (newProps.href) {
    newProps.href = xssFilters.uriInDoubleQuotedAttr(props.href);
  }
  return {
    ...el,
    props: newProps
  };
};

const isExternalLink = (link) => {
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
  return handleFilterXss(
    <a href={url} onClick={onLinkClick}>
      {children}
    </a>
  );
};

// Use external link renderer when images are not allowed
const imageHandler =
  (renderImages) =>
  ({ src, alt }) =>
    renderImages ? (
      <img src={src} alt={alt} />
    ) : (
      <LinkRenderer url={src}>{alt}</LinkRenderer>
    );

const linkHandler = ({ href, children }) => {
  return <LinkRenderer url={href}>{children}</LinkRenderer>;
};

export const customComponents = (renderImages) => ({
  // Root handler is no longer required due to react-markdown updates
  img: imageHandler(renderImages),
  a: linkHandler
});
