import React from "react";
import { Modal } from "pi-ui";
import { RecordForm } from "../RecordForm";
import styles from "./styles.module.css";

export function ModalForm({
  onClose,
  title = "Change Password",
  show,
  onSubmit,
  children,
  formProps,
  ...props
}) {
  return (
    <Modal
      {...{ onClose, title, show, ...props }}
      className={styles.modalWrapper}
    >
      <RecordForm onSubmit={onSubmit} className={styles.form} {...formProps}>
        {children}
      </RecordForm>
    </Modal>
  );
}
