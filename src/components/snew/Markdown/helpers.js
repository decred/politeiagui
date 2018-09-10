import React from "react";
import xssFilters from "xss-filters";
import * as modalTypes from "../../Modal/modalTypes";

export const traverseChildren = (el, cb) => {
  const filterChildren = (c) => React.Children.map(c,
    child => traverseChildren(child, cb)
  );
  let newElement = null;
  if(el.children) {
    newElement = {
      ...el,
      children: filterChildren(el.children)
    };
  } else if (el.props && el.props.children) {
    newElement = {
      ...el,
      children: filterChildren(el.props.children)
    };
  }
  return newElement ? cb(newElement) : cb(el);
};

export const handleFilterXss = (el) => {
  if (typeof(el) === "string") {
    return xssFilters.inHTMLData(el);
  }
  const props = el.props;
  if(!props) {
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

const verifyExternalLink = (e, link, confirmWithModal) => {
  e.preventDefault();
  const tmpLink = document.createElement("a");
  tmpLink.href = link;
  const externalLink = (tmpLink.hostname !== window.top.location.hostname);
  // if this is an external link, show confirmation dialog
  if (externalLink) {
    confirmWithModal(modalTypes.CONFIRM_ACTION, {
      title: "External Link Warning",
      message: (
        <React.Fragment>
          <p style={{ marginBottom: "10px" }}>
            This link will take you to an external website!
          </p>
          <p>
            <strong>External link: {link}</strong>
          </p>
          <p style={{ marginTop: "10px" }}>
            Are you sure you want to proceed?
          </p>
        </React.Fragment>
      )
    }).then(confirm => {
      if (confirm) {
        window.location.href = link;
      }
    });
  } else {
    window.location.href = link;
  }
};

export const customRenderers = (filterXss, confirmWithModal) => ({
  image: ({ src, alt }) => {
    return <a rel="nofollow" onClick={(e) => verifyExternalLink(e, src, confirmWithModal)} href={src}>{alt}</a>;
  },
  link: ({ href, children }) => {
    return <a rel="nofollow" onClick={(e) => verifyExternalLink(e, href, confirmWithModal)} href={href}>{children[0]}</a>;
  },
  root: (el) => {
    if(filterXss) {
      el = traverseChildren(el, handleFilterXss);
    }
    const {
      children,
      ...props
    } = el;
    return <div {...props}>{children}</div>;
  }
});
