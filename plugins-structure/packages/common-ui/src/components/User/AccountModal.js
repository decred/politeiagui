import React from "react";
import { Modal, Text } from "pi-ui";
import { Input, SubmitButton } from "../RecordForm";
import styles from "./styles.module.css";
import { ModalConfirm, ModalForm } from "../Modal";
import { Payment } from "../Payment";

export const AccountPasswordChangeModal = ({
  onClose,
  title = "Change Password",
  show,
  onSubmit,
}) => {
  return (
    <ModalForm {...{ onClose, title, show }} onSubmit={onSubmit}>
      <Input id="c" name="current" label="Current Password" type="password" />
      <Input id="new" name="password" label="New Password" type="password" />
      <Input id="vf" name="verify" label="Verify Password" type="password" />
      <SubmitButton>Change Password</SubmitButton>
    </ModalForm>
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

export const UserRegistrationFeeModal = ({
  onClose,
  title = "Complete your registration",
  show,
  address,
}) => {
  return (
    <Modal {...{ onClose, title, show }} className={styles.modal}>
      <Text>
        Politeia requires you to pay a small registration fee of exactly 0.1
        DCR. This helps keep Politeia free of things like spam and comment
        manipulation.
      </Text>
      <Payment address={address} value={0.1} />
    </Modal>
  );
};
