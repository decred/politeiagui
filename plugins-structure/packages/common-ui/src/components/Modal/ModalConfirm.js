import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Icon, Message, Modal } from "pi-ui";
import { useModal } from "./ModalProvider";
import styles from "./styles.module.css";
import { MarkdownRenderer } from "../Markdown";

export const ModalConfirm = ({
  show,
  onClose,
  onSubmit,
  title,
  message,
  successTitle,
  successMessage,
  onCloseSuccess,
  confirmButtonText,
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
      className={styles.modalConfirmWrapper}
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
          <div data-testid="modal-confirm-message">
            <MarkdownRenderer body={message} />
          </div>
          <div className={styles.modalButtons}>
            <Button
              data-testid="modal-confirm-submit-button"
              onClick={handleSubmit}
            >
              {confirmButtonText}
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.modalContent}>
          <div data-testid="modal-confirm-success-message">
            <MarkdownRenderer body={successMessage} />
          </div>
          <div className={styles.modalButtons}>
            <Button
              data-testid="modal-confirm-ok-button"
              onClick={handleCloseSuccess}
            >
              Ok
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

ModalConfirm.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onCloseSuccess: PropTypes.func,
  onSubmit: PropTypes.func,
  successTitle: PropTypes.string,
  successMessage: PropTypes.string,
  confirmButtonText: PropTypes.string,
};

ModalConfirm.defaultProps = {
  title: "Confirm Action",
  message: "Are you sure?",
  successMessage: "",
  confirmButtonText: "Confirm",
  onCloseSuccess: () => {},
  onSubmit: () => {},
  onClose: () => {},
};
