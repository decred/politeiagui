import React from "react";
import { Button } from "pi-ui";
import styles from "./AttachFileButton.module.css";
import attachSVG from "./attach-file.svg";
import useBooleanState from "src/hooks/useBooleanState";
import usePolicy from "src/hooks/usePolicy";
import ModalAttachFiles from "src/componentsv2/ModalAttachFiles";

const AttachFileButton = ({ onChange, ...props }) => {
  const { policy } = usePolicy();
  const [
    showAttachFileModal,
    openAttachFileModal,
    closeAttachFileModal
  ] = useBooleanState(false);

  const handleOnChange = (v) => {
    onChange(v);
    closeAttachFileModal();
  }

  return (
    <>
    <Button
      className={styles.attachFileButton}
      onClick={openAttachFileModal}
      {...props}
    >
      <img alt="Attach" src={attachSVG} />
    </Button>
    <ModalAttachFiles
      show={showAttachFileModal} 
      policy={policy}
      onChange={handleOnChange}
      onClose={closeAttachFileModal}
    />
    </>
  );
};

export default AttachFileButton;
