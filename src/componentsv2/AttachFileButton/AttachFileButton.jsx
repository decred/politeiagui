import React from "react";
import { Button, classNames } from "pi-ui";
import styles from "./AttachFileButton.module.css";
import attachSVG from "./attach-file.svg";
import { useAttachFileModal } from "./hooks";
import usePolicy from "src/hooks/usePolicy";
import ModalAttachFiles from "src/componentsv2/ModalAttachFiles";

const AttachFileButton = ({ className, onChange, ...props }) => {
  const { policy } = usePolicy();
  const {
    showAttachFileModal,
    openAttachFileModal,
    closeAttachFileModal
  } = useAttachFileModal();

  const handleOnChange = (v) => {
    onChange(v);
    closeAttachFileModal();
  }

  return (
    <>
    <Button
      className={classNames(styles.attachFileButton, className)}
      onClick={openAttachFileModal}
      {...props}
    >
      <img alt="Attach" src={attachSVG} />
    </Button>
    <ModalAttachFiles
      onChange={handleOnChange}
      show={showAttachFileModal} 
      onClose={closeAttachFileModal}
      policy={policy}
    />
    </>
  );
};

export default AttachFileButton;
