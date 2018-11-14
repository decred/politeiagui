import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import PasswordChange from "../../PasswordChange/index.js";

const ChangeUsernameModal = ({ closeAllModals }) => (
  <ModalContentWrapper title={"Change Password"} onClose={closeAllModals}>
    <PasswordChange />
  </ModalContentWrapper>
);

export default modalConnector(ChangeUsernameModal);
