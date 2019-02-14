import React from "react";
import { diffWords } from "diff";
import htmlParser from "react-markdown/plugins/html-parser";
import xssFilters from "xss-filters";
import * as modalTypes from "../../Modal/modalTypes";

const diffCheck = node => {
  const className = node.attribs && node.attribs.classname;
  // if the line is edited
  const isChild = !node.name && !!node.parent;
  return isChild
    ? node.parent.type === "tag" && node.type === "text"
    : (node.name === "li" || node.name === "span" || node.name === "br") &&
        (node.type === "tag" || node.type === "text") &&
        (className === "diff-in" ||
          className === "diff-out" ||
          className === "diff-line-in" ||
          className === "diff-line-out");
};

export const htmlParserRules = htmlParser({
  isValidNode: node => {
    return node.type !== "script" && diffCheck(node);
  }
});

export const insertDiffHTML = (oldComment, newComment) => {
  const handleDiffLine = line => {
    const { removed, value, added } = line;
    let diffLine = "";
    if (removed) {
      const dw = diffWords(removed ? removed : "", value ? value : "");
      let result = "";
      dw.forEach(x => (result += handleDiffString(x, false, !!removed)));
      diffLine += `<li className="diff-line-out">${result}&zwnj;</li>\n\n`;
    }
    if (added) {
      const dw = diffWords(removed ? removed : "", value ? value : "");
      let result = "";
      dw.forEach(x => (result += handleDiffString(x, added, false)));
      diffLine += `<li className="diff-line-in">${result}&zwnj;</li>\n\n`;
    }
    if (!removed && !added) {
      diffLine += value ? value + "<br>\n" : "";
    }
    return diffLine;
  };
  const handleDiffString = (string, isLineAdded, isLineRemoved) => {
    const { removed, added, value } = string;
    if (removed) {
      if (isLineAdded) return "";
      return `<span className="diff-out">${value}</span>`;
    } else if (added) {
      if (isLineRemoved) return "";
      return `<span className="diff-in">${value}</span>`;
    }
    return value;
  };
  // disable read-only mode
  let commentDiff = [];
  // split comments into lines to get line numbers in order
  //  to make the line-by-line comparison
  const oldComLines =
    oldComment && 0 !== oldComment.length ? oldComment.split("\n") : [];
  const newComLines =
    newComment && 0 !== newComment.length ? newComment.split("\n") : [];
  commentDiff = newComLines.map((x, i) => {
    if (oldComLines.includes(x)) {
      return { value: x, line: i, removed: false, added: false };
    }
    // if line was not found, it means it was added
    return { value: x, line: i, removed: false, added: true };
  });
  // search for removed lines
  oldComLines.forEach((x, i) => {
    if (!newComLines.includes(x)) {
      // adds the removed line into the "removed" field
      commentDiff[i]
        ? (commentDiff[i].removed = x)
        : (commentDiff[i] = { line: i, removed: x, added: false });
    }
  });
  let finalDiff = "";
  commentDiff.forEach(line => {
    if (line.value !== "" || line.removed) {
      finalDiff += handleDiffLine(line);
    } else {
      finalDiff += "";
    }
  });
  return finalDiff;
};

export const traverseChildren = (el, cb) => {
  const filterChildren = c =>
    React.Children.map(c, child => traverseChildren(child, cb));
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

const verifyExternalLink = (e, link, confirmWithModal) => {
  e.preventDefault();
  // Does this to prevent xss attacks
  const tmpLink = document.createElement("a");
  tmpLink.href = link;
  const externalLink =
    tmpLink.hostname && tmpLink.hostname !== window.top.location.hostname;
  // if this is an external link, show confirmation dialog
  if (externalLink) {
    document.title = "Leaving Politeia...";
    confirmWithModal(modalTypes.CONFIRM_ACTION, {
      style: {
        maxWidth: "600px",
        display: "flex",
        flexFlow: "column"
      },
      altStyle: {
        maxWidth: "98%",
        padding: "10px 9px",
        minHeight: "80px",
        alignItems: "center"
      },
      title: "Warning: Leaving Politeia",
      message: (
        <div style={{ textAlign: "left", alignItems: "center" }}>
          <p style={{ marginBottom: "10px" }}>
            You are about to be sent to an external website. This can result in
            unintended consequences.
            <strong> DO NOT</strong> enter your Politeia credentials or reveal
            any other sensitive information.
          </p>
          <br />
          <div>
            <b>External link:</b>
            <br />
            <div
              style={{
                display: "inline-block",
                border: "1px solid #dcdcdc",
                padding: ".5em",
                borderRadius: "6px",
                background: "#dcdcdc5c",
                width: "100%",
                marginTop: "1em"
              }}
            >
              <span style={{ wordWrap: "break-word" }}>
                {" "}
                {tmpLink.protocol + "//"}
                <strong className="red">{tmpLink.hostname}</strong>
                {tmpLink.pathname}
              </span>
            </div>
          </div>
          <br />
          <p style={{ marginTop: "12px", textAlign: "center" }}>
            Are you <strong> sure</strong> you want to open this link?
          </p>
        </div>
      ),
      cancelText: "Cancel",
      submitText: "Proceed"
    }).then(confirm => {
      if (confirm) {
        const newWindow = window.open();
        newWindow.opener = null;
        newWindow.location.href = link;
        newWindow.target = "_blank";
      }
    });
  } else if (tmpLink.hostname) {
    window.location.href = link;
    document.title = this.props.proposal.name;
  } else {
    console.log("Blocked potentially malicious link: ", link);
  }
};

const imageHandler = confirmWithModal => ({ src, alt }) => {
  return (
    <a
      target="_blank"
      rel="nofollow noopener noreferrer"
      onClick={e =>
        confirmWithModal && verifyExternalLink(e, src, confirmWithModal)
      }
      href={src}
    >
      {alt}
    </a>
  );
};

const linkHandler = confirmWithModal => ({ href, children }) => {
  return (
    <a
      target="_blank"
      rel="nofollow noopener noreferrer"
      onClick={e =>
        confirmWithModal && verifyExternalLink(e, href, confirmWithModal)
      }
      href={href}
    >
      {children[0]}
    </a>
  );
};

const rootHandler = filterXss => el => {
  if (filterXss) {
    el = traverseChildren(el, handleFilterXss);
  }
  const { children, ...props } = el;
  return <div {...props}>{children}</div>;
};

export const customRenderers = (filterXss, confirmWithModal) => {
  const imageRenderer = imageHandler(confirmWithModal);
  const linkRenderer = linkHandler(confirmWithModal);
  const rootRenderer = rootHandler(filterXss);

  return {
    image: imageRenderer,
    imageReference: imageRenderer,
    link: linkRenderer,
    linkReference: linkRenderer,
    root: rootRenderer
  };
};
