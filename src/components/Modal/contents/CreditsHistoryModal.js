import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import ProposalCredits from "../../ProposalCreditsManager";
import proposalCredisConnector from "../../../connectors/proposalCredits";

const ProposalCreditsModal = ({
  closeAllModals,
  isApiRequestingUserProposalCredits
}) =>
  !isApiRequestingUserProposalCredits && (
    <ModalContentWrapper title={"Account History"} onClose={closeAllModals}>
      <ProposalCredits />
    </ModalContentWrapper>
  );

export default modalConnector(proposalCredisConnector(ProposalCreditsModal));
