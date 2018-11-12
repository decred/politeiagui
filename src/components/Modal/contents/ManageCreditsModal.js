import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import proposalCredisConnector from "../../../connectors/proposalCredits";
import * as modalTypes from "../modalTypes";

class ProposalCreditsModal extends React.Component {
  componentDidMount() {
    this.props.onUserProposalCredits();
    this.props.onPurchaseProposalCredits();
    this.props.onFetchProposalPaywallPayment();
  }
  render() {
    const { closeModal, openModal, proposalCredits } = this.props;
    return (
      <ModalContentWrapper title={"Manage Credits"} onClose={closeModal}>
        <div className="modal-content__wrapper">
          <p>
            Proposal credits are needed to submit proposals, and each proposal
            requires 1 credit.
          </p>
          <span style={{ fontSize: "18px", padding: "20px 8px" }}>
            Proposal Credits: <b>{proposalCredits}</b>
          </span>
          <div
            style={{ display: "flex", width: "100%", justifyContent: "center" }}
          >
            <button
              onClick={() => openModal(modalTypes.PURCHASE_CREDITS_MODAL)}
            >
              Purchase Credits
            </button>
            <button onClick={() => openModal(modalTypes.CREDITS_HISTORY_MODAL)}>
              Account History
            </button>
          </div>
        </div>
      </ModalContentWrapper>
    );
  }
}

export default modalConnector(proposalCredisConnector(ProposalCreditsModal));
