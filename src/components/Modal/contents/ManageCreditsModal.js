import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import proposalCredisConnector from "../../../connectors/proposalCredits";
import ButtonWithLoadingIcon from "../../snew/ButtonWithLoadingIcon";
import * as modalTypes from "../modalTypes";

class ProposalCreditsModal extends React.Component {
  constructor(props) {
    super(props);
    this.openCreditsHistoryAfterApi = this.openCreditsHistoryAfterApi.bind(
      this
    );
  }
  componentDidMount() {
    this.props.onPurchaseProposalCredits();
    this.props.onFetchProposalPaywallPayment();
  }

  openCreditsHistoryAfterApi() {
    this.props.onUserProposalCredits();
    this.props.openModal(modalTypes.CREDITS_HISTORY_MODAL);
  }

  render() {
    const {
      closeModal,
      openModal,
      proposalCredits,
      isApiRequestingUserProposalCredits
    } = this.props;
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
            <ButtonWithLoadingIcon
              onClick={this.openCreditsHistoryAfterApi}
              text="Account History"
              isLoading={isApiRequestingUserProposalCredits}
              style={{ overflow: "hidden" }}
            />
          </div>
        </div>
      </ModalContentWrapper>
    );
  }
}

export default modalConnector(proposalCredisConnector(ProposalCreditsModal));
