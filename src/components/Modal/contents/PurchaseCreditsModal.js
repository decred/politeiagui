import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import Purchase from "../../ProposalCreditsManager/Purchase";

const ProposalCreditsModal = ({ closeModal }) => (
  <ModalContentWrapper
    title={"Purchase Credits"}
    onClose={closeModal}
  >
    <Purchase />
  </ModalContentWrapper>
);

export default modalConnector(ProposalCreditsModal);
