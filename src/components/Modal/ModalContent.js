import React from "react";
import * as modalTypes from "./modalTypes";
import ConfirmAction from "./contents/ConfirmAction";
import ConfirmActionWithReason from "./contents/ConfirmActionWithReason";
import Login from "./contents/Login";
import PaywallModal from "./contents/PaywallModal";
import CreditsHistoryModal from "./contents/CreditsHistoryModal";
import ManageCreditsModal from "./contents/ManageCreditsModal";
import PurchaseCreditsModal from "./contents/PurchaseCreditsModal";
import ChangeUsernameModal from "./contents/ChangeUsernameModal";
import ChangePasswordModal from "./contents/ChangePasswordModal";
import SearchVotesModal from "./contents/SearchVotesModal";
import StartVoteModal from "../StartVoteModal";
import ImportIdentityModal from "./contents/ImportIdentityModal";
import { withRouter } from "react-router-dom";
import ProposalVersionDiff from "./contents/ProposalVersionDiff";
import WelcomeModal from "./contents/WelcomeModal";

const mapModalTypeToContent = {
  [modalTypes.CONFIRM_ACTION]: ({ modalData }) => (
    <ConfirmAction me={modalData} />
  ),
  [modalTypes.CONFIRM_ACTION_WITH_REASON]: ({ modalData }) => (
    <ConfirmActionWithReason me={modalData} />
  ),
  [modalTypes.LOGIN]: ({ location, modalData }) => (
    <Login me={modalData} pathname={location.pathname} />
  ),
  [modalTypes.PAYWALL_MODAL]: () => <PaywallModal />,
  [modalTypes.CREDITS_HISTORY_MODAL]: () => <CreditsHistoryModal />,
  [modalTypes.MANAGE_CREDITS_MODAL]: () => <ManageCreditsModal />,
  [modalTypes.PURCHASE_CREDITS_MODAL]: () => <PurchaseCreditsModal />,
  [modalTypes.CHANGE_USERNAME_MODAL]: () => <ChangeUsernameModal />,
  [modalTypes.CHANGE_PASSWORD_MODAL]: () => <ChangePasswordModal />,
  [modalTypes.START_VOTE_MODAL]: ({ modalData }) => (
    <StartVoteModal me={modalData} />
  ),
  [modalTypes.SEARCH_PROPOSAL_VOTES]: ({ modalData }) => (
    <SearchVotesModal me={modalData} />
  ),
  [modalTypes.IMPORT_IDENTITY_MODAL]: () => <ImportIdentityModal />,
  [modalTypes.PROPOSAL_VERSION_DIFF]: ({ modalData }) => (
    <ProposalVersionDiff me={modalData} />
  ),
  [modalTypes.WELCOME_MODAL]: ({ modalData }) => <WelcomeModal me={modalData} />
};

const ModalContent = ({ modalData, location }) => {
  const mappedModal = mapModalTypeToContent[modalData.type];
  return mappedModal
    ? mappedModal({ modalData, location })
    : console.log("modal not mapped");
};

export default withRouter(ModalContent);
