import React from "react";
import { diffWordsWithSpace } from "diff";
import DiffLine from "./DiffLine";
import { arrayDiff, lineDiffFunc, getLineArray, getFilesDiff } from "./helpers";
import styles from "./Diff.module.css";

const handleDiffLine = (
  line,
  index,
  oldTextLineCounter,
  newTextLineCounter
) => {
  const { removed, value, added } = line;
  const diffLine = [];
  const dw = diffWordsWithSpace(removed ? removed : "", value ? value : "");
  const diffStrings = dw.map(({ value }) => value);
  diffLine.push(
    <DiffLine
      key={index}
      removed={removed}
      added={added}
      content={diffStrings}
      removedIndex={added ? newTextLineCounter : oldTextLineCounter}
    />
  );

  return diffLine;
};

export const insertDiffHTML = (oldTextBody, newTextBody) => {
  const oldComLines = getLineArray(oldTextBody);
  const newComLines = getLineArray(newTextBody);

  let newTextLineCounter = 0,
    oldTextLineCounter = 0;
  const linesDiff = arrayDiff(newComLines, oldComLines, lineDiffFunc)
    .sort((a, b) => a.lineIndex - b.lineIndex)
    .map((line, index) => {
      if (line.value !== "" || line.removed) {
        if (line.added) {
          newTextLineCounter += 1;
        } else if (line.removed) {
          oldTextLineCounter += 1;
        } else {
          newTextLineCounter += 1;
          oldTextLineCounter += 1;
        }
        return handleDiffLine(
          line,
          index,
          oldTextLineCounter,
          newTextLineCounter
        );
      } else {
        newTextLineCounter += 1;
        oldTextLineCounter += 1;
        return (
          <DiffLine
            addedIndex={newTextLineCounter}
            removedIndex={oldTextLineCounter}
            key={index}
          />
        );
      }
    });
  return (
    <table
      className={styles.diffTable}
      cellSpacing="0"
      cellPadding="0"
    >
      <tbody>{linesDiff}</tbody>
    </table>
  );
};

const fileHandler = file => file.mime.includes("image") ? (
  <img
    className={styles.diffImage}
    alt={file.name}
    src={`data:${file.mime};base64,${file.payload}`}
  />
) : (
  <p>{file.name}</p>
);

export const insertFilesDiff = (oldFiles, newFiles) => {
  const files = getFilesDiff(newFiles, oldFiles);
  return (
    <table className={styles.diffTable}>
      {files.map((file, key) => {
        const formattedFile = fileHandler(file);
        return file.added ? (
          <div className={styles.fileAdded} key={key}>
            {formattedFile}
          </div>
        ) : file.removed ? (
          <div className={styles.fileRemoved} key={key}>
            {formattedFile}
          </div>
        ) : (
          <div className={styles.fileUnchanged} key={key}>
            {formattedFile}
          </div>
        );
      })}
    </table>
  );
};
