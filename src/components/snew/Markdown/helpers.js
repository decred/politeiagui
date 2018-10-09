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
  // Does this to prevent xss attacks
  const tmpLink = document.createElement("a");
  tmpLink.href = link;
  const externalLink = (tmpLink.hostname && tmpLink.hostname !== window.top.location.hostname);
  // if this is an external link, show confirmation dialog
  if (externalLink) {
    confirmWithModal(modalTypes.CONFIRM_ACTION, {
      title: "External Link Warning",
      message: (
        <React.Fragment>
          <p style={{ marginBottom: "10px" }}>
            You are about to be sent to an external website! <strong className="red">Do not</strong> enter your Politeia credentials or reveal any other sensitive information.
          </p>
          <p>
            External link: {link}
          </p>
          <p>
            External domain: <strong className="red">{tmpLink.hostname}</strong>
          </p>
          <p style={{ marginTop: "10px" }}>
            Are you sure you want to proceed?
          </p>
        </React.Fragment>
      )
    }).then(confirm => {
      if (confirm) {
        const newWindow = window.open();
        newWindow.opener = null;
        newWindow.location.href = link;
        newWindow.target = "_blank";
      }
    });
  } else if(tmpLink.hostname) {
    window.location.href = link;
  } else {
    console.log("Blocked potentially malicious link: ", link);
  }
};

export const customRenderers = (filterXss, confirmWithModal) => ({
  image: ({ src, alt }) => {
    return <a
      target="_blank"
      rel="nofollow noopener noreferrer"
      onClick={(e) => confirmWithModal && verifyExternalLink(e, src, confirmWithModal)}
      href={src}>{alt}
    </a>;
  },
  link: ({ href, children }) => {
    return( <a
      target="_blank"
      rel="nofollow noopener noreferrer"
      onClick={(e) => confirmWithModal && verifyExternalLink(e, href, confirmWithModal)}
      href={href}
    >{children[0]}</a>);
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
