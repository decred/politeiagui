import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import { diffWordsWithSpace } from "diff";
import {
  arrayDiff,
  lineDiffFunc,
  getLineArray,
  getFilesDiff,
  getLineitemsDiff,
  setLineitemParams
} from "./helpers";
import DiffLine from "./DiffLine";
import styles from "./Diff.module.css";
import HelpMessage from "src/components/HelpMessage";
import { ImageThumbnail, TextThumbnail } from "src/components/Files";
import ModalFullImage from "src/components/ModalFullImage";
import useModalContext from "src/hooks/utils/useModalContext";
import DiffLineitemsDatasheet from "./DiffLineitems";
import { SheetRenderer } from "src/components/InvoiceDatasheet/InvoiceDatasheet";
import { createTableHeaders } from "src/components/InvoiceDatasheet";

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
      removed={!!removed}
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
  const [handleOpenModal, handleCloseModal] = useModalContext();
  const openFullImageModal = (file) => {
    handleOpenModal(ModalFullImage, {
      images: [file],
      onClose: handleCloseModal
    });
  };

  return file.mime.includes("image") ? (
    <>
      <ImageThumbnail
        className={className}
        file={file}
        viewOnly={true}
        onClick={openFullImageModal}
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

export const DiffText = ({ newText, oldText }) => {
  const diff = diffWordsWithSpace(oldText, newText);
  return diff.map((elem, index) => (
    <span
      key={index}
      className={classNames(
        elem.added && styles.lineAdded,
        elem.removed && styles.lineRemoved
      )}
    >
      {elem.value}
    </span>
  ));
};

export const DiffInvoices = ({ oldData, newData, className, proposals }) => {
  const newLineitems = setLineitemParams(newData.lineitems, {
    rate: newData.contractorrate
  });
  const oldLineitems = setLineitemParams(oldData.lineitems, {
    rate: oldData.contractorrate
  });

  const lineitemsDiff = getLineitemsDiff(newLineitems, oldLineitems);

  return (
    <SheetRenderer headers={createTableHeaders()} className={className}>
      <DiffLineitemsDatasheet lineItems={lineitemsDiff} proposals={proposals} />
    </SheetRenderer>
  );
};

DiffText.propTypes = {
  newText: PropTypes.string.isRequired,
  oldText: PropTypes.string
};
