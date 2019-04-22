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

export const insertDiffHTML = (oldTextBody, newTextBody) => {
  const handleDiffLine = (line, index) => {
    const { removed, value, added } = line;
    const diffLine = [];

    const dw = diffWordsWithSpace(removed ? removed : "", value ? value : "");
    if (removed) {
      const diffStrings = [];
      dw.forEach((x, i) =>
        diffStrings.push(handleDiffString(x, false, !!removed, i))
      );
      diffLine.push(
        <li className="diff-line-out" key={index}>
          {diffStrings}
        </li>
      );
    }
    if (added) {
      const diffStrings = [];
      dw.forEach((x, i) =>
        diffStrings.push(handleDiffString(x, added, false, i))
      );
      // the index is added .5 to differentiate from added lines
      diffLine.push(
        <li className="diff-line-in" key={index + ".5"}>
          {diffStrings}
        </li>
      );
    }
    if (!removed && !added) {
      diffLine.push(
        value ? <MarkdownRenderer body={value} key={index} /> : null
      );
    }
    return diffLine;
  };

  const handleDiffString = (string, isLineAdded, isLineRemoved, index) => {
    const { removed, added, value } = string;
    if (removed) {
      if (isLineAdded) return <span />;
      return (
        <span className="diff-out" key={index}>
          <MarkdownRenderer body={value} />
        </span>
      );
    } else if (added) {
      if (isLineRemoved) return <span />;
      return (
        <span className="diff-in" key={index}>
          <MarkdownRenderer body={value} />
        </span>
      );
    }
    return value;
  };
  const arrayDiff = (newCommentBody, oldCommentBody, lineDiffFunc) => [
    ...newCommentBody.filter(lineDiffFunc(oldCommentBody)).map(markAsAdded),
    ...oldCommentBody.filter(lineDiffFunc(newCommentBody)).map(markAsRemoved),
    ...newCommentBody.filter(lineEqFunc(oldCommentBody)).map(markAsUnchanged)
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
  const lineDiffFunc = arr => elem =>
    !arr.some(arrelem => arrelem.value === elem.value);
  const lineEqFunc = arr => elem => !lineDiffFunc(arr)(elem);
  const getLineArray = string =>
    string && string.length
      ? string.split("\n").map((line, index) => ({ value: line, index: index }))
      : [];

  const oldComLines = getLineArray(oldTextBody);
  const newComLines = getLineArray(newTextBody);
  // order matters
  const linesDiff = arrayDiff(newComLines, oldComLines, lineDiffFunc).sort(
    (a, b) => a.lineIndex - b.lineIndex
  );

  return linesDiff.map((line, index) => {
    if (line.value !== "" || line.removed) {
      return handleDiffLine(line, index);
    } else {
      return <span key={index} />;
    }
  });
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
    const currentTitle = document.title;
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
                {tmpLink.pathname + tmpLink.search + tmpLink.hash}
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
      document.title = currentTitle;
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
