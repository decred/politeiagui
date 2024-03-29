import React from "react";
import { Modal, Text } from "pi-ui";
import { Input, SubmitButton } from "../RecordForm";
import styles from "./styles.module.css";
import { ModalConfirm, ModalForm } from "../Modal";
import { Payment } from "../Payment";
import { LoginForm } from "./Form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  validatePasswordChangeForm,
  validateUsernameChangeForm,
} from "./validation";

export const AccountPasswordChangeModal = ({
  onClose,
  title = "Change Password",
  show,
  onSubmit,
  minpasswordlength,
}) => {
  return (
    <ModalForm
      formProps={{
        resolver: yupResolver(
          validatePasswordChangeForm({ minpasswordlength })
        ),
      }}
      {...{ onClose, title, show }}
      onSubmit={onSubmit}
      data-testid="account-password-change-modal"
    >
      <Input
        id="current"
        name="current"
        label="Current Password"
        type="password"
      />
      <Input
        id="newpassword"
        name="newpassword"
        label="New Password"
        type="password"
      />
      <Input
        id="verify"
        name="verify"
        label="Verify Password"
        type="password"
      />
      <SubmitButton id="account-change-password-button">
        Change Password
      </SubmitButton>
    </ModalForm>
  );
};

export const AccountUsernameChangeModal = ({
  onClose,
  title = "Change Username",
  show,
  onSubmit,
  usernameValidationRegex,
}) => (
  <ModalForm
    {...{ onClose, title, show }}
    onSubmit={onSubmit}
    data-testid="account-username-change-modal"
    formProps={{
      resolver: yupResolver(
        validateUsernameChangeForm({ usernameRegex: usernameValidationRegex })
      ),
    }}
  >
    <Input id="username" name="username" label="New Username" />
    <Input id="password" name="password" label="Password" type="password" />
    <SubmitButton id="account-change-username-button">
      Change Username
    </SubmitButton>
  </ModalForm>
);

export const AccountClearDataModal = ({
  onClose,
  title = "Clear Account Data",
  show,
  onSubmit,
}) => (
  <ModalConfirm
    data-testid="account-clear-data-modal"
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
    <Modal
      {...{ onClose, title, show }}
      className={styles.modal}
      data-testid="registration-fee-modal"
    >
      <Text>
        Politeia requires you to pay a small registration fee of exactly 0.1
        DCR. This helps keep Politeia free of things like spam and comment
        manipulation.
      </Text>
      <Payment address={address} value={0.1} />
    </Modal>
  );
};

export const LoginModal = ({ onClose, show, onSubmit }) => (
  <Modal {...{ onClose, show }}>
    <LoginForm onSubmit={onSubmit} className={styles.flatForm} />
  </Modal>
);
