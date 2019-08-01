import React from "react";
import { Modal } from "pi-ui";
import LoginForm from "src/containers/User/Login/Form";

const ModalLogin = ({ title = "Login", onLoggedIn, onDismissModal, ...props }) => {
  return (
    <Modal
      title={title}
      onClose={onDismissModal}
      {...props}
      contentStyle={{ width: "100%" }}
    >
      <LoginForm onLoggedIn={onLoggedIn} hideTitle redirectToPrivacyPolicyRoute />
    </Modal>
  );
};

export default ModalLogin;
