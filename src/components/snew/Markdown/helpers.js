import React from "react";
import xssFilters from "xss-filters";
import * as modalTypes from "../../Modal/modalTypes";

function extractHostname(url) {
  console.log("HOSTNAME 1", url, typeof url);
  //find & remove protocol (http, ftp, etc.) and get hostname
  let hostname = url.indexOf("//") > -1 ? url.split("/")[2] : url.split("/")[0];
  console.log("HOSTNAME 2", url, hostname);
  //find & remove port number
  hostname = hostname.split(":")[0];
  console.log("HOSTNAME 3", hostname);
  //find & remove "?"
  hostname = hostname.split("?")[0];
  console.log("HOSTNAME 4", hostname);
  return hostname;
}

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
  const hostname = extractHostname(link);
  console.log("HOSTNAME", hostname);
  const externalLink = (hostname && hostname !== window.top.location.hostname);
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
            External domain: <strong className="red">{hostname}</strong>
          </p>
          <p style={{ marginTop: "10px" }}>
            Are you sure you want to proceed?
          </p>
        </React.Fragment>
      )
    }).then(confirm => {
      if (confirm) {
        // Creates a new element to check the hostname
        const tmpLink = document.createElement("a");
        tmpLink.href = link;
        const newWindow = window.open();
        newWindow.opener = null;
        newWindow.location.href = tmpLink.hostname === hostname ? link : "//" + link;
        newWindow.target = "_blank";
      }
    });
  } else if(hostname) {
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
    console.log("HOSTNAME HREF", href);
    return <a
      target="_blank"
      rel="nofollow noopener noreferrer"
      onClick={(e) => confirmWithModal && verifyExternalLink(e, href, confirmWithModal)}
      href={href}
    >{children[0]}</a>;
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
