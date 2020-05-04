import React from "react";
import { Modal, P, Button } from "pi-ui";
import styles from "./ModalAttachFiles.module.css";
import FilesInput from "src/components/Files/Input";
import usePolicy from "src/hooks/api/usePolicy";

const ModalAttachFiles = ({
  title = "Upload new file",
  show,
  onChange,
  onClose
}) => {
  const { policy } = usePolicy();
  const accepted = policy.validmimetypes.join(",");
  return (
    <Modal title={title} show={show} onClose={onClose}>
      <div className={styles.wrapper}>
        <P>Please upload an image you want to attach to your proposal.</P>
        {policy && (
          <P>
            Valid MIME types - {accepted} <br />
            Max image size - 512kb <br />
            Max number of files - {policy.maximages}
          </P>
        )}
        <P className={styles.greyText}>
          If you have any problems with your upload, try using a smaller file.
        </P>
        <div className={styles.selectFileWrapper}>
          <FilesInput onChange={onChange} acceptedFiles={accepted}>
            <Button
              className={styles.selectFileButton}
              type="submit"
              kind={"primary"}>
              Select file
            </Button>
          </FilesInput>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAttachFiles;
