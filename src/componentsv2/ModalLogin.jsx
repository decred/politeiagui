import React from "react";
import { Modal } from "pi-ui";
import LoginForm from "src/containers/User/Login/Form";

const ModalLogin = ({ title = "Login", onClose, ...props }) => {
  return (
    <Modal
      title={title}
      onClose={onClose}
      {...props}
      contentStyle={{ width: "100%" }}
    >
      <LoginForm onLoggedIn={onClose} hideTitle redirectToPrivacyPolicyRoute />
    </Modal>
  );
};

export default ModalLogin;
