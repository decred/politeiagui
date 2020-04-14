import React, { useCallback } from "react";
import { classNames } from "pi-ui";
import styles from "./AttachFileInput.module.css";
import attachSVG from "./attach-file.svg";
import usePolicy from "src/hooks/api/usePolicy";
import ModalAttachFiles from "src/components/ModalAttachFiles";
import useModalContext from "src/hooks/utils/useModalContext";

const AttachFiles = ({ onChange, label, small, acceptedFiles, ...props }) => {
  const { policy } = usePolicy();
  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOnChange = useCallback(
    (v) => {
      onChange(v);
      handleCloseModal();
    },
    [onChange, handleCloseModal]
  );

  const openAttachModal = () => {
    handleOpenModal(ModalAttachFiles, {
      acceptedFiles,
      policy,
      onChange: handleOnChange,
      onClose: handleCloseModal
    });
  };

  return (
    <>
      <span
        className={classNames(styles.attachFileButton, small && styles.small)}
        onClick={openAttachModal}
        {...props}>
        {label}
        <img alt="Attach" src={attachSVG} />
      </span>
    </>
  );
};
export default AttachFiles;
