import React from "react";
import { Modal, P, Button } from "pi-ui";
import styles from "./ModalAttachFiles.module.css";
import FilesInput from "src/componentsv2/Files/Input";

const ModalAttachFiles = ({ title = "Upload new file", onChange, policy, ...props }) => (
  <Modal
    title={title}
    style={{}}
    {...props}
  >
    <div className={styles.wrapper}>
    <P>
    Please upload an image you want to attach to your proposal.
    </P>
    {policy && 
      <P>
        <b>Valid MIME types - </b> {policy.validmimetypes} <br />
        <b>Max image size - </b> 512kb <br />
        <b>Max number of files - </b> {policy.maximages} <br />
      </P>
    }
    <P className={styles.greyText}>
      If you have any problems with your upload, try using a smaller file.
    </P>
    <P className={styles.selectFileWrapper}>
      <FilesInput onChange={onChange}>
        <Button
          className={styles.selectFileButton}
          type="submit"
          kind={"primary"}
        >
          Select file
        </Button>      
      </FilesInput>
    </P>
    </div>
  </Modal>
);

export default ModalAttachFiles;

