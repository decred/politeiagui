import React, { useCallback } from "react";
import { classNames } from "pi-ui";
import styles from "./AttachFileInput.module.css";
import attachSVG from "./attach-file.svg";
import useBooleanState from "src/hooks/utils/useBooleanState";
import usePolicy from "src/hooks/api/usePolicy";
import ModalAttachFiles from "src/componentsv2/ModalAttachFiles";

const AttachFiles = ({ onChange, label, small, acceptedFiles, ...props }) => {
  const { policy } = usePolicy();
  const [
    showAttachFileModal,
    openAttachFileModal,
    closeAttachFileModal
  ] = useBooleanState(false);

  const handleOnChange = useCallback(
    v => {
      onChange(v);
      closeAttachFileModal();
    },
    [onChange, closeAttachFileModal]
  );

  return (
    <>
      <span
        className={classNames(styles.attachFileButton, small && styles.small)}
        onClick={openAttachFileModal}
        {...props}
      >
        {label}
        <img alt="Attach" src={attachSVG} />
      </span>
      <ModalAttachFiles
        show={showAttachFileModal}
        acceptedFiles={acceptedFiles}
        policy={policy}
        onChange={handleOnChange}
        onClose={closeAttachFileModal}
      />
    </>
  );
};

export default AttachFiles;
