import React from "react";
import * as modalTypes from "./modalTypes";
import ConfirmAction from "./contents/ConfirmAction";
import ConfirmActionWithReason from "./contents/ConfirmActionWithReason";
import Login from "./contents/Login";
import OnBoard from "./contents/OnBoard";
import PaywallModal from "./contents/PaywallModal";
import CreditsHistoryModal from "./contents/CreditsHistoryModal";
import ManageCreditsModal  from "./contents/ManageCreditsModal";
import PurchaseCreditsModal from "./contents/PurchaseCreditsModal";
import { withRouter } from "react-router-dom";

const mapModalTypeToContent = {
  [modalTypes.CONFIRM_ACTION]: ({ modalData }) => <ConfirmAction me={modalData} />,
  [modalTypes.CONFIRM_ACTION_WITH_REASON]: ({ modalData }) => <ConfirmActionWithReason me={modalData} />,
  [modalTypes.LOGIN]: ({ location, modalData }) => <Login  me={modalData} pathname={location.pathname} />,
  [modalTypes.ONBOARD]: ({ modalData }) => <OnBoard me={modalData} />,
  [modalTypes.PAYWALL_MODAL]: () => <PaywallModal />,
  [modalTypes.CREDITS_HISTORY_MODAL]: () => <CreditsHistoryModal />,
  [modalTypes.MANAGE_CREDITS_MODAL]: () => <ManageCreditsModal />,
  [modalTypes.PURCHASE_CREDITS_MODAL]: () => <PurchaseCreditsModal />
};

const ModalContent = ({ modalData, location }) => {
  const mappedModal = mapModalTypeToContent[modalData.type];
  return mappedModal ? mappedModal({ modalData, location }) : console.log("modal not mapped");
};

export default withRouter(ModalContent);
