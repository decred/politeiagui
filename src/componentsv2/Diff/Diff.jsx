import React, { useMemo, useState } from "react";
import { classNames } from "pi-ui";
import { diffWordsWithSpace } from "diff";
import { arrayDiff, lineDiffFunc, getLineArray, getFilesDiff } from "./helpers";
import DiffLine from "./DiffLine";
import styles from "./Diff.module.css";
import HelpMessage from "src/componentsv2/HelpMessage";
import { ImageThumbnail, TextThumbnail } from "src/componentsv2/Files";
import ModalFullImage from "src/componentsv2/ModalFullImage";

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

export const DiffHTML = ({ oldTextBody, newTextBody }) => {
  const linesDiff = useMemo(() => {
    const oldComLines = getLineArray(oldTextBody);
    const newComLines = getLineArray(newTextBody);
    let newTextLineCounter = 0,
      oldTextLineCounter = 0;
    return arrayDiff(newComLines, oldComLines, lineDiffFunc)
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
  }, [newTextBody, oldTextBody]);
  return (
    <table className={styles.diffTable} cellSpacing="0" cellPadding="0">
      <tbody>{linesDiff}</tbody>
    </table>
  );
};

const FileWrapper = ({ file, className }) => {
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const showModal = file => () => {
    setShowFullImageModal(file);
  };
  const closeModal = () => {
    setShowFullImageModal(false);
  };
  return file.mime.includes("image") ? (
    <>
      <ImageThumbnail
        className={className}
        file={file}
        viewOnly={true}
        onClick={showModal}
      />
      <ModalFullImage
        image={file}
        show={!!showFullImageModal}
        onClose={closeModal}
      />
    </>
  ) : (
    <TextThumbnail file={file} viewOnly />
  );
};

export const FilesDiff = ({ oldFiles, newFiles }) => {
  const files = getFilesDiff(newFiles, oldFiles);
  return (
    <table className={classNames(styles.diffTable)}>
      <tbody>
        <tr className={styles.files}>
          {files.length > 0 ? (
            files.map((file, key) => {
              return file.added ? (
                <td key={key}>
                  <FileWrapper file={file} className={styles.fileAdded} />
                </td>
              ) : file.removed ? (
                <td key={key}>
                  <FileWrapper file={file} className={styles.fileRemoved} />
                </td>
              ) : (
                <td key={key}>
                  <FileWrapper file={file} className={styles.fileUnchanged} />
                </td>
              );
            })
          ) : (
            <td className={styles.noFiles}>
              <HelpMessage>There are no attachment changes</HelpMessage>
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
};
