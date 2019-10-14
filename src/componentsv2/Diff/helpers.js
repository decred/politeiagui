import React from "react";
import { rootHandler } from "src/componentsv2/Markdown/helpers";
import { compiler } from "markdown-to-jsx";
import DiffStrings from "./DiffStrings";
import trim from "lodash/trim";
import styles from "./Diff.module.css";

const markAsAdded = elem => ({
  ...elem,
  removed: false,
  added: true
});

const markAsRemoved = elem => ({
  ...elem,
  removed: true,
  added: false
});

const markAsUnchanged = elem => ({
  ...elem,
  removed: false,
  added: false
});

const tagClassName = className => elem => ({
  ...elem,
  props: {
    ...elem.props,
    className: className
  }
});
const getElemArray = (stringArr, elemArr) => (type, props, children) => {
  const el = React.createElement(type, props, children);
  if (children && children.length > 0) {
    React.Children.map(children, c => {
      if (typeof c === "string") {
        stringArr.push(c);
        const el = React.createElement(type, props, c);
        elemArr.push(el);
        return c;
      }
    });
  }
  return el;
};

const overrider = (stringArr, rawStringArr, elemArr) => ({
  createElement: getElemArray(stringArr, rawStringArr, elemArr)
});

const formatArray = elArray => (value, index) => ({
  value,
  index,
  props: elArray[index].props,
  type: elArray[index].type
});

export const getMarkdownTextDiff = (oldText, newText) => {
  const newStringArr = [],
    newElements = [],
    oldStringArr = [],
    oldElements = [];

  compiler(oldText, overrider(oldStringArr, oldElements));
  compiler(newText, overrider(newStringArr, newElements));

  const oldStringArray = oldStringArr.map(formatArray(oldElements));
  const newStringArray = newStringArr.map(formatArray(newElements));
  let diffContents = [
    ...oldStringArray
      .filter(newLineDiffFunc(newStringArray))
      .map(markAsRemoved),
    ...newStringArray.filter(newLineDiffFunc(oldStringArray)).map(markAsAdded),
    ...newStringArray.filter(newLineEqFunc(oldStringArray)).map(markAsUnchanged)
  ].sort((a, b) => a.index - b.index);

  const customRendererDiff = (type, props, children) => {
    let newProps = { ...props };
    let customElements = [];
    let newType = type;
    let newChildren = React.Children.map(children, renderChild => {
      if (typeof renderChild !== "string") return renderChild;

      const [diffHead, ...diffTail] = diffContents;
      if (diffHead && diffHead.value === renderChild) {
        if (diffHead.type !== type) {
          // find the renderChild corresp diff content
          const renderChildDiffContent = diffContents.find(
            el => trim(el.value) === trim(renderChild) && el.type === type
          );
          const renderChildDiffContentPosition = diffContents.indexOf(
            renderChildDiffContent
          );
          const rest = diffContents.filter(
            (_, key) => key > renderChildDiffContentPosition
          );
          customElements = [
            tagClassName(styles.stringRemoved)(oldElements[diffHead.index])
          ];
          newType = "div";
          newProps = { className: styles.customElements };
          diffContents = [...rest];
          if (renderChildDiffContent.added) {
            return <DiffStrings newString={renderChild} />;
          }
        }

        if (
          diffHead.props.href !== props.href ||
          diffHead.props.src !== props.src
        ) {
          const oldLink = diffHead.props.href || diffHead.props.src;
          const newLink = props.href || props.src;
          const [, ...rest] = diffTail;
          diffContents = [...rest];
          return (
            <DiffStrings
              propChanges
              oldLink={oldLink}
              newLink={newLink}
              newString={renderChild}
            />
          );
        }
        diffContents = [...diffTail];

        if (diffHead.added) {
          return <DiffStrings newString={renderChild} />;
        }
        return renderChild;
      }

      const renderChildDiffContent = diffContents.find(
        el => trim(el.value) === trim(renderChild)
      );
      const renderChildDiffContentPosition = diffContents.indexOf(
        renderChildDiffContent
      );
      const prevContents = diffContents.filter(
        el => el && el.index < renderChildDiffContent.index
      );
      const sameIndexPrevContents = diffContents.filter(
        (el, i) =>
          el.index === renderChildDiffContent.index &&
          i <= renderChildDiffContentPosition
      );
      const nextContents = [
        ...diffContents.filter(
          (el, i) =>
            el.index === renderChildDiffContent.index &&
            i > renderChildDiffContentPosition
        ),
        ...diffContents.filter(el => el.index > renderChildDiffContent.index)
      ];

      diffContents = nextContents;

      customElements = prevContents
        .map(c => oldElements[c.index])
        .map(tagClassName(styles.stringRemoved));

      if (customElements.length > 0) {
        newType = "div";
        newProps = { className: styles.customElements };
      }

      if (sameIndexPrevContents.length > 0) {
        // same index contents
        const [added] = sameIndexPrevContents.filter(c => c.added);
        const [removed] = sameIndexPrevContents.filter(c => c.removed);
        const [unchanged] = sameIndexPrevContents.filter(
          c => !c.added && !c.removed
        );
        if (added && removed) {
          const addedEl = newElements[added.index];
          const removedEl = oldElements[removed.index];
          if (addedEl.type !== removedEl.type) {
            customElements = [
              tagClassName(styles.stringRemoved)(removedEl),
              ...customElements
            ];
            newType = "div";
            props = {
              ...props,
              className: styles.stringAdded
            };
            return renderChild;
          }
          return (
            <DiffStrings oldString={removed.value} newString={added.value} />
          );
        }
        if (removed && unchanged) {
          customElements = [
            tagClassName(styles.stringRemoved)(oldElements[removed.index]),
            ...customElements
          ];
          newType = "div";
        }
      }
      return renderChild;
    });

    if (customElements.length > 0) {
      newChildren = [
        ...customElements,
        React.createElement(type, props, newChildren)
      ];
    }

    return rootHandler(true)(newType, newProps, newChildren);
  };

  return compiler(newText, { createElement: customRendererDiff });
};

export const newLineDiffFunc = arr => elem =>
  !arr.some(arrelem => {
    const sameValues = trim(arrelem.value) === trim(elem.value);
    const sameTypes = elem.type === arrelem.type;
    const sameLinks = arrelem.props.href === elem.props.href;
    const sameSrcs = arrelem.props.src === elem.props.src;
    return sameValues && sameTypes && sameLinks && sameSrcs;
  });

export const newLineEqFunc = arr => elem => !newLineDiffFunc(arr)(elem);

const markFileAsAdded = elem => ({ ...elem, added: true });
const markFileAsRemoved = elem => ({ ...elem, removed: true });

const filesDiffFunc = arr => elem =>
  !arr.some(
    arrelem => arrelem.name === elem.name && arrelem.payload === elem.payload
  );
const filesEqFunc = arr => elem => !filesDiffFunc(arr)(elem);

export const getFilesDiff = (newFiles, oldFiles) => [
  ...newFiles.filter(filesDiffFunc(oldFiles)).map(markFileAsAdded),
  ...oldFiles.filter(filesDiffFunc(newFiles)).map(markFileAsRemoved),
  ...newFiles.filter(filesEqFunc(oldFiles)) // for unchanged files
];
