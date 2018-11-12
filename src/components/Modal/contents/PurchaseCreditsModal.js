import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import Purchase from "../../ProposalCreditsManager/Purchase";

const ProposalCreditsModal = ({ closeAllModals }) => (
  <ModalContentWrapper title={"Purchase Credits"} onClose={closeAllModals}>
    <Purchase />
  </ModalContentWrapper>
);

export default modalConnector(ProposalCreditsModal);
