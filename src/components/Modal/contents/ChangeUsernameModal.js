import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import ChangeUsername from "../../UsernameChange/index.js";

const ChangeUsernameModal = ({ closeAllModals }) => (
  <ModalContentWrapper title={"Change Username"} onClose={closeAllModals}>
    <ChangeUsername />
  </ModalContentWrapper>
);

export default modalConnector(ChangeUsernameModal);
