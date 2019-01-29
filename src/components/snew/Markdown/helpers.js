import React from "react";
import { diffLines, diffWords } from "diff";
import htmlParser from "react-markdown/plugins/html-parser";
import xssFilters from "xss-filters";
import * as modalTypes from "../../Modal/modalTypes";

const diffCheck = node => {
  const className = node.attribs && node.attribs.classname;
  // if the line is edited
  const isChild = !node.name && !!node.parent;
  return isChild
    ? node.parent.type === "tag" && node.type === "text"
    : (node.name === "li" || node.name === "span") &&
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
  const diffL = diffLines(oldComment, newComment, {
    ignoreWhitespace: false,
    newlineIsToken: true
  });
  const handleDiffString = (string, isLineAdded, isLineRemoved) => {
    const { added, removed, value } = string;
    if (added) {
      if (isLineRemoved) {
        return "";
      }
      return `<span className="diff-in"> ${value}</span>`;
    } else if (removed) {
      if (isLineAdded) {
        return "";
      }
      return `<span className="diff-out"> ${value}</span>`;
    }
    return value;
  };
  const handleDiffLine = line => {
    const { count, added, removed } = line;
    const lineAdded = diffL.filter(lin => lin.count === count && lin.added);
    const lineRemoved = diffL.filter(lin => lin.count === count && lin.removed);
    const diffW = diffWords(
      lineRemoved.length ? lineRemoved[0].value : "",
      lineAdded.length ? lineAdded[0].value : "",
      { ignoreCase: true }
    );
    const dw = diffW.map(word => {
      return handleDiffString(word, added, removed);
    });
    return dw.length && dw.length > 1 ? dw.join("") : dw[0];
  };

  const handleDiffLines = line => {
    const { added, removed, value } = line;
    const diffLine = handleDiffLine(line);
    // console.log("diflineeee", diffLine);
    if (added) {
      return `<li className="diff-line-in"> ${diffLine}</li>`;
    } else if (removed) {
      return `<li className="diff-line-out"> ${diffLine}</li>`;
    }
    return `${value}`;
  };
  const c = diffL
    .reduce(
      (accumulated, current) => accumulated + handleDiffLines(current),
      "<br>"
    )
    .replace(/(\r\n|\n|\r)/gm, "<br>");
  return c;
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
