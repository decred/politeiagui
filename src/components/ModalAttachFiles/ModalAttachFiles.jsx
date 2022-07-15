import React from "react";
import { Modal, P, Button } from "pi-ui";
import styles from "./ModalAttachFiles.module.css";
import FilesInput from "src/components/Files/Input";
import usePolicy from "src/hooks/api/usePolicy";

const ModalAttachFiles = ({
  title = "Attach a file",
  subTitle = "Select the file that you would like to attach to your proposal.",
  show,
  onChange,
  onClose
}) => {
  const { policyPi: policy } = usePolicy();
  return (
    <Modal title={title} show={show} onClose={onClose}>
      <div className={styles.wrapper}>
        <P>{subTitle}</P>
        {policy && (
          <P>
            Valid MIME types - image/png <br />
            Max image size - 512kb <br />
            Max number of files - {policy.imagefilecountmax}
          </P>
        )}
        <P className={styles.greyText}>
          If you have any problems with your upload, try using a smaller file.
        </P>
        <div className={styles.selectFileWrapper}>
          <FilesInput onChange={onChange} acceptedFiles={"image/png"}>
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
};

export default ModalAttachFiles;
