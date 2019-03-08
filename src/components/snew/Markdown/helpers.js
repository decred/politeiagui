import React from "react";
import { diffWordsWithSpace } from "diff";
import htmlParser from "react-markdown/plugins/html-parser";
import xssFilters from "xss-filters";
import * as modalTypes from "../../Modal/modalTypes";
import MarkdownRenderer from "./Markdown";

const diffCheck = node => {
  const className = node.attribs.classname;
  return (
    node.type === "tag" &&
    node.name === "span" &&
    (className === "diff-in" || className === "diff-out")
  );
};

export const htmlParserRules = htmlParser({
  isValidNode: node => {
    return node.type !== "script" && diffCheck(node);
  }
});

// insertDiffHTML - The function compares the oldTextBody with the newTextBody line by line.
// the lines that have differences are highlighted as "added" or "removed".
export const insertDiffHTML = (oldTextBody, newTextBody) => {
  // handleDiffLine - The function gets one line and checks which words have changed.
  // if the line is added, it wraps the line with a green mark using a HTML tag. If the
  // line is removed, it wraps it with a red mark.
  const handleDiffLine = (line, index) => {
    const { removed, value, added } = line;
    const diffLine = [];

    const dw = diffWordsWithSpace(removed ? removed : "", value ? value : "");
    if (removed) {
      const result = [];
      dw.forEach((x, i) =>
        result.push(handleDiffString(x, false, !!removed, i))
      );
      diffLine.push(
        <li className="diff-line-out" key={index}>
          {result}
        </li>
      );
    }
    if (added) {
      const result = [];
      dw.forEach((x, i) => result.push(handleDiffString(x, added, false, i)));
      // the index is added .5 to differentiate from added lines
      diffLine.push(
        <li className="diff-line-in" key={index + ".5"}>
          {result}
        </li>
      );
    }
    if (!removed && !added) {
      diffLine.push(
        value ? (
          <MarkdownRenderer body={value} key={index} />
        ) : (
          <p key={index}>""</p>
        )
      );
    }
    return diffLine;
  };
  // handleDiffString - The function gets a string, checks if the string is added, removed or unchanged
  const handleDiffString = (string, isLineAdded, isLineRemoved, index) => {
    const { removed, added, value } = string;
    if (removed) {
      // check if line is removed so it doesn't add a red mark into a green line
      if (isLineAdded) return "";
      return (
        <span className="diff-out" key={index}>
          <MarkdownRenderer body={value} />
        </span>
      );
    } else if (added) {
      // same checking here to avoid red marks on green lines
      if (isLineRemoved) return "";
      return (
        <span className="diff-in" key={index}>
          <MarkdownRenderer body={value} />
        </span>
      );
    }
    return value;
  };
  const arrayDiff = (newCommentBody, oldCommentBody, diffFunc) => [
    ...newCommentBody.filter(diffFunc(oldCommentBody)).map(markAsAdded),
    ...oldCommentBody.filter(diffFunc(newCommentBody)).map(markAsRemoved),
    ...newCommentBody.filter(eqFunc(oldCommentBody)).map(markAsUnchanged)
  ];
  const markAsAdded = elem => ({
    value: elem.value,
    lineIndex: elem.index,
    removed: false,
    added: true,
    status: "line added"
  });
  const markAsRemoved = elem => ({
    lineIndex: elem.index,
    removed: elem.value,
    added: false,
    status: "line removed"
  });
  const markAsUnchanged = elem => ({
    value: elem.value,
    lineIndex: elem.index,
    removed: false,
    added: false,
    status: "line unchanged"
  });
  const diffFunc = arr => elem =>
    !arr.some(arrelem => arrelem.value === elem.value);
  const eqFunc = arr => elem =>
    arr.some(arrelem => arrelem.value === elem.value);
  const getLineArray = string =>
    string && string.length
      ? string.split("\n").map((line, index) => ({ value: line, index: index }))
      : [];
  // split comments into lines to get line numbers in order
  //  to make the line-by-line comparison
  const oldComLines = getLineArray(oldTextBody);
  const newComLines = getLineArray(newTextBody);
  const linesDiff = arrayDiff(newComLines, oldComLines, diffFunc).sort(
    (a, b) => a.lineIndex - b.lineIndex
  );

  const finalDiff = [];
  // loop the array to run the handleDiffLine function for all lines
  linesDiff.forEach((line, index) => {
    // if line is not empty
    if (line.value !== "" || line.removed) {
      finalDiff.push(handleDiffLine(line, index));
    } else {
      finalDiff.push(<span key={index} />);
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
