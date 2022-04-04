import React from "react";
import xssFilters from "xss-filters";

export const XSS_ALERT =
  "You tried to render a malicious URL. The URL is being converted in order to avoid XSS attacks";

export const traverseChildren = (el, cb) => {
  const filterChildren = (c) =>
    React.Children.map(c, (child) => traverseChildren(child, cb));
  let newElement = null;
  if (el.children) {
    newElement = {
      ...el,
      children: filterChildren(el.children),
    };
  } else if (el.props && el.props.children) {
    const filteredChildren = filterChildren(el.props.children);
    newElement = {
      ...el,
      props: {
        ...el.props,
        children: filteredChildren,
      },
    };
  }
  return newElement ? cb(newElement) : cb(el);
};

const isExternalLink = (link) => {
  const tmpLink = document.createElement("a");
  tmpLink.href = link;
  const externalLink =
    tmpLink.hostname && tmpLink.hostname !== window.top.location.hostname;

  return externalLink;
};

const LinkRenderer = ({ url, children }) => {
  function onLinkClick(e) {
    if (isExternalLink(url)) {
      e.preventDefault();
      console.log("clicked URL:", url);
    }
  }
  return (
    <a href={url} onClick={onLinkClick}>
      {children}
    </a>
  );
};

// Use external link renderer when images are not allowed
const imageHandler =
  (renderImages) =>
  ({ src, alt }) => {
    const filteredSrc = xssFilters.uriInDoubleQuotedAttr(src);
    if (filteredSrc !== src) {
      console.warn(XSS_ALERT);
    }
    return renderImages ? (
      <img src={filteredSrc} alt={alt} />
    ) : (
      <LinkRenderer url={filteredSrc}>{alt}</LinkRenderer>
    );
  };

const linkHandler = ({ href, children }) => {
  const newHref = xssFilters.uriInDoubleQuotedAttr(href);
  if (newHref !== href) {
    console.warn(XSS_ALERT);
  }
  return <LinkRenderer url={newHref}>{children}</LinkRenderer>;
};

const blockquoteHandler =
  (isDiff) =>
  ({ children }) => {
    let newChildren = [...children];
    if (isDiff) {
      // Remove all paragraph tags from blockquotes, so diff can recognize the
      // differences inside blockquotes
      newChildren = traverseChildren(<>{children}</>, (el) => {
        if (React.isValidElement(el)) {
          return el.type === "p" ? <>{el.props.children}</> : el;
        }
        return el;
      });
    }
    return <blockquote>{newChildren}</blockquote>;
  };

export const customRenderers = (renderImages, isDiff) => {
  return {
    img: imageHandler(renderImages),
    a: linkHandler,
    blockquote: blockquoteHandler(isDiff),
  };
};
