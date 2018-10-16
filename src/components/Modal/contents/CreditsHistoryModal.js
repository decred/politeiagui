import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import ProposalCredits from "../../ProposalCreditsManager";

const ProposalCreditsModal = ({ closeAllModals }) => (
  <ModalContentWrapper
    title={"Account History"}
    onClose={closeAllModals}
  >
    <ProposalCredits />
  </ModalContentWrapper>
);

export default modalConnector(ProposalCreditsModal);
