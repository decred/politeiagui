import React from "react";
import { rootHandler } from "src/componentsv2/Markdown/helpers";
import { compiler } from "markdown-to-jsx";
import DiffStrings from "./DiffStrings";
import trim from "lodash/trim";
import styles from "./Diff.module.css";
// import takeWhile from "lodash/takeWhile";

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

const getElemArray = (stringArr, rawStringArr, elemArr) => (
  type,
  props,
  children
) => {
  const el = React.createElement(type, props, children);
  if (children && children.length > 0) {
    const newChildren = React.Children.map(children, c => {
      if (typeof c === "string") {
        stringArr.push(c);
        rawStringArr.push(markdownToRawText(type, props, c));
        return c;
      }
    });
    if (elemArr) {
      elemArr.push(React.createElement(type, props, newChildren));
    }
  }
  return el;
};

const overrider = (stringArr, rawStringArr, elemArr = null) => ({
  createElement: getElemArray(stringArr, rawStringArr, elemArr)
});

const markdownToRawText = (type, props, child) => {
  const formatter = {
    a: `[${child}](${props.href})`,
    img: `![${child}](${props.href})`,
    h1: `# ${child}`,
    h2: `## ${child}`,
    h3: `### ${child}`,
    h4: `#### ${child}`,
    h5: `##### ${child}`,
    h6: `###### ${child}`,
    strong: `**${child}**`,
    em: `*${child}*`,
    del: `~~${child}~~`,
    ul: `* ${child}`,
    ol: `${props.start}. ${child}`,
    pre: `\`\`\`${child}\`\`\``,
    code: `\`${child}\``
  };
  return formatter[type] ? formatter[type] : child;
};

export const getMarkdownTextDiff = (oldText, newText) => {
  const newStringArr = [],
    newStringRawArr = [],
    oldStringArr = [],
    oldStringRawArr = [],
    oldElements = [];

  compiler(oldText, overrider(oldStringArr, oldStringRawArr, oldElements));
  compiler(newText, overrider(newStringArr, newStringRawArr));

  const oldStringArray = oldStringArr.map((value, index) => ({ value, index }));
  const newStringArray = newStringArr.map((value, index) => ({ value, index }));

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
    const newChildren = React.Children.map(children, renderChild => {
      if (typeof renderChild !== "string") return renderChild;

      const [diffHead, ...diffTail] = diffContents;

      if (diffHead && diffHead.value === renderChild) {
        // const foundNewStringIndex = newStringArr.indexOf(
        //   diffHead.value
        // );
        // const foundOldStringIndex = oldStringArr.indexOf(
        //   diffHead.value
        // );
        // const [newStringRaw] = newStringRawArr.splice(foundNewStringIndex, 1);
        // let oldStringRaw = null;
        // if (foundOldStringIndex !== -1) {
        //   [oldStringRaw] = oldStringRawArr.splice(foundOldStringIndex, 1);
        //   oldStringArr.splice(foundOldStringIndex, 1);
        // } else {
        //   [oldStringRaw] = oldStringRawArr.splice(foundNewStringIndex, 1);
        //   oldStringArr.splice(foundNewStringIndex, 1);
        // }
        // newStringArr.splice(foundNewStringIndex, 1);
        diffContents = [...diffTail];

        // if (oldStringRaw && oldStringRaw !== newStringRaw) {
        //   const [, ...tail] = diffContents;
        //   console.log("TAIL", [...tail], [...diffContents]);
        //   diffContents = tail;
        //   return (
        //     <DiffStrings
        //       oldString=""
        //       forceChange
        //       rawNewString={newStringRaw}
        //       rawOldString={oldStringRaw}
        //       newString={renderChild}
        //     />
        //   );
        // }

        if (diffHead.added) {
          return <DiffStrings oldString="" newString={renderChild} />;
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
      console.log(prevContents);
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
        // const [unchanged] = sameIndexPrevContents.filter(c => !c.added && !c.removed);
        if (added && removed) {
          return (
            <DiffStrings oldString={removed.value} newString={added.value} />
          );
        }
      }
      return renderChild;
    });

    return rootHandler(true)(newType, newProps, [
      ...customElements,
      ...newChildren
    ]);
  };

  return compiler(newText, { createElement: customRendererDiff });
};

export const newLineDiffFunc = arr => elem =>
  !arr.some(arrelem => trim(arrelem.value) === trim(elem.value));

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
