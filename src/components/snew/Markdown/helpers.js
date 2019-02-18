import React from "react";
import { diffWords } from "diff";
import htmlParser from "react-markdown/plugins/html-parser";
import xssFilters from "xss-filters";
import * as modalTypes from "../../Modal/modalTypes";
import Showdown from "showdown";

export const htmlParserRules = htmlParser({
  isValidNode: node => {
    return node.type !== "script";
  }
});

// insertDiffHTML - The function compares the oldTextBody with the newTextBody line by line.
// the lines that have differences are highlighted as "added" or "removed".
export const insertDiffHTML = (oldTextBody, newTextBody) => {
  // handleDiffLine - The function gets one line and checks which words have changed.
  // if the line is added, it wraps the line with a green mark using a HTML tag. If the
  // line is removed, it wraps it with a red mark.
  const handleDiffLine = line => {
    const { removed, value, added } = line;
    let diffLine = "";
    if (removed) {
      const dw = diffWords(removed ? removed : "", value ? value : "");
      let result = "";
      dw.forEach(x => (result += handleDiffString(x, false, !!removed)));
      diffLine += `<li className="diff-line-out">\n${result}\n</li>\n\n`;
    }
    if (added) {
      const dw = diffWords(removed ? removed : "", value ? value : "");
      let result = "";
      dw.forEach(x => (result += handleDiffString(x, added, false)));
      diffLine += `<li className="diff-line-in">\n${result}\n</li>\n\n`;
    }
    if (!removed && !added) {
      diffLine += value ? value + "<br>\n" : "";
    }
    return diffLine;
  };
  // handleDiffString - The function gets a string, checks if the string is added, removed or unchanged
  const handleDiffString = (string, isLineAdded, isLineRemoved) => {
    const isHeader = string =>
      string === "# " ||
      string === "## " ||
      string === "### " ||
      string === "#### " ||
      string === "##### " ||
      string === "###### ";
    const { removed, added, value } = string;
    const converter = new Showdown.Converter({ omitExtraWLInCodeBlocks: true });
    if (removed) {
      // check if line is removed so it doesn't add a red mark into a green line
      if (isLineAdded) return "";
      return `<div className="diff-out">${
        !isHeader(value) ? converter.makeHtml(value) : value
      }</div>\n`;
    } else if (added) {
      // same checking here to avoid red marks on green lines
      if (isLineRemoved) return "";
      return `<div className="diff-in">${
        !isHeader(value) ? converter.makeHtml(value) : value
      }</div>\n`;
    }
    return value;
  };
  // disable read-only mode
  let commentDiff = [];
  // split comments into lines to get line numbers in order
  //  to make the line-by-line comparison
  const oldComLines =
    oldTextBody && 0 !== oldTextBody.length ? oldTextBody.split("\n") : [];
  const newComLines =
    newTextBody && 0 !== newTextBody.length ? newTextBody.split("\n") : [];
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
  // loop the array to run the handleDiffLine function for all lines
  commentDiff.forEach(line => {
    // if line is not empty
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
