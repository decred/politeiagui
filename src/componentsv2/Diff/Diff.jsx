import React, { useMemo, useState } from "react";
import { classNames } from "pi-ui";
import { getMarkdownTextDiff, getFilesDiff } from "./helpers";
import styles from "./Diff.module.css";
import HelpMessage from "src/componentsv2/HelpMessage";
import { ImageThumbnail, TextThumbnail } from "src/componentsv2/Files/Thumbnail";
import ModalFullImage from "src/componentsv2/ModalFullImage";

export const DiffHTML = ({ oldTextBody, newTextBody }) => {
  const linesDiff = useMemo(() =>
    getMarkdownTextDiff(oldTextBody, newTextBody)
  , [newTextBody, oldTextBody]);
  return (
    <div className="markdown-body">
      {linesDiff}
    </div>
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
    <TextThumbnail
      file={file}
      viewOnly
    />
  );
};

export const FilesDiff = ({ oldFiles, newFiles }) => {
  const files = getFilesDiff(newFiles, oldFiles);
  return (
    <table className={classNames(styles.diffFilesTable)}>
      <tbody>
        <tr className={styles.files}>
          {files.length > 0 ? files.map((file, key) => {
            return file.added ? (
              <td key={key}>
                <FileWrapper file={file} className={styles.fileAdded}/>
              </td>
            ) : file.removed ? (
              <td key={key}>
                <FileWrapper file={file} className={styles.fileRemoved}/>
              </td>
            ) : (
              <td key={key}>
                <FileWrapper file={file} className={styles.fileUnchanged}/>
              </td>
            );
          }) : (
            <td className={styles.noFiles}>
              <HelpMessage>
                There are no attachment changes
              </HelpMessage>
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
};
