import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Icon, Message, Modal, Text } from "pi-ui";
import { useModal } from "./ModalProvider";
import styles from "./styles.module.css";

export const ModalConfirm = ({
  show,
  onClose,
  onSubmit,
  title,
  message,
  successTitle,
  successMessage,
  onCloseSuccess,
}) => {
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [, close] = useModal();
  const modalTitle = (success && successTitle) || title;
  async function handleSubmit() {
    try {
      await onSubmit();
      setSuccess(true);
    } catch (error) {
      setError(error);
    }
  }
  async function handleCloseSuccess() {
    try {
      await onCloseSuccess();
      close();
    } catch (error) {
      setError(error);
    }
  }
  async function handleClose() {
    try {
      await onClose();
      close();
    } catch (error) {
      setError(error);
    }
  }
  return (
    <Modal
      show={show}
      onClose={handleClose}
      title={modalTitle}
      iconComponent={
        !success ? (
          <Icon type="info" size={26} />
        ) : (
          <Icon type="checkmark" size={26} />
        )
      }
    >
      {error && <Message kind="error">{error.toString()}</Message>}
      {!success ? (
        <div className={styles.modalContent}>
          <Text>{message}</Text>
          <div className={styles.modalButtons}>
            <Button onClick={handleSubmit}>Confirm</Button>
          </div>
        </div>
      ) : (
        <div className={styles.modalContent}>
          <Text>{successMessage}</Text>
          <div className={styles.modalButtons}>
            <Button onClick={handleCloseSuccess}>Ok</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

ModalConfirm.propTypes = {
  title: PropTypes.string,
  message: PropTypes.node,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onCloseSuccess: PropTypes.func,
  onSubmit: PropTypes.func,
  successTitle: PropTypes.string,
  successMessage: PropTypes.node,
};

ModalConfirm.defaultProps = {
  title: "Confirm Action",
  message: "Are you sure?",
  onCloseSuccess: () => {},
  onSubmit: () => {},
  onClose: () => {},
};
