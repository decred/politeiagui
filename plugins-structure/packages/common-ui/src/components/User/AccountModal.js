import React from "react";
import { Modal } from "pi-ui";
import { Input, RecordForm, SubmitButton } from "../RecordForm";
import styles from "./styles.module.css";
import { ModalConfirm } from "../Modal";

export const AccountPasswordChangeModal = ({
  onClose,
  title = "Change Password",
  show,
  onSubmit,
}) => {
  return (
    <Modal {...{ onClose, title, show }} className={styles.modal}>
      <RecordForm onSubmit={onSubmit} className={styles.form}>
        <Input id="c" name="current" label="Current Password" type="password" />
        <Input id="new" name="password" label="New Password" type="password" />
        <Input id="vf" name="verify" label="Verify Password" type="password" />
        <SubmitButton>Change Password</SubmitButton>
      </RecordForm>
    </Modal>
  );
};

export const AccountClearDataModal = ({
  onClose,
  title = "Clear Account Data",
  show,
  onSubmit,
}) => (
  <ModalConfirm
    {...{ onClose, title, show, onSubmit }}
    successMessage="Data Cleared"
  />
);
