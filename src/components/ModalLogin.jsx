import { Modal } from "pi-ui";
import React from "react";
import LoginForm from "src/containers/User/Login/Form";
import useOnRouteChange from "src/hooks/utils/useOnRouteChange";

const ModalLogin = ({ title = "Login", onLoggedIn, onClose, ...props }) => {
  useOnRouteChange(onClose);
  return (
    <Modal
      title={title}
      onClose={onClose}
      iconType="info"
      data-testid="modal-login"
      iconSize="lg"
      data-testid="modal-login"
      {...props}
      contentStyle={{ width: "100%" }}
      titleStyle={{ paddingRight: "4rem" }}>
      <LoginForm
        onLoggedIn={onLoggedIn}
        hideTitle
        redirectToPrivacyPolicyRoute
        emailId="modalloginemail"
        passwordId="modalloginpassword"
        renderPrivacyPolicyModal={false}
      />
    </Modal>
  );
};

export default React.memo(ModalLogin);
