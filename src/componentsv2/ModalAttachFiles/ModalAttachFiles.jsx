import React from "react";
import { Modal, P, Button } from "pi-ui";
import styles from "./ModalAttachFiles.module.css";
import FilesInput from "src/componentsv2/Files/Input";

const ModalAttachFiles = ({
  title = "Upload new file",
  show,
  policy,
  onChange,
  onClose
}) => (
  <Modal title={title} show={show} onClose={onClose}>
    <div className={styles.wrapper}>
      <P>Please upload an image you want to attach to your proposal.</P>
      {policy && (
        <P>
          Valid MIME types - {policy.validmimetypes} <br />
          Max image size - 512kb <br />
          Max number of files - {policy.maximages}
        </P>
      )}
      <P className={styles.greyText}>
        If you have any problems with your upload, try using a smaller file.
      </P>
      <div className={styles.selectFileWrapper}>
        <FilesInput onChange={onChange}>
          <Button
            className={styles.selectFileButton}
            type="submit"
            kind={"primary"}
          >
            Select file
          </Button>
        </FilesInput>
      </div>
    </div>
  </Modal>
);

export default ModalAttachFiles;
