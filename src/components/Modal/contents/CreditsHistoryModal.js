import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import ProposalCredits from "../../ProposalCreditsManager";

const ProposalCreditsModal = ({ closeModal }) => (
  <ModalContentWrapper
    title={"Proposal Credits History"}
    onClose={closeModal}
  >
    <ProposalCredits />
  </ModalContentWrapper>
);

export default modalConnector(ProposalCreditsModal);
