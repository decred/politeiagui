import React from "react";
import * as modalTypes from "./modalTypes";
import ConfirmAction from "./contents/ConfirmAction";
import ConfirmActionWithReason from "./contents/ConfirmActionWithReason";
import Login from "./contents/Login";
import OnBoard from "./contents/OnBoard";
import { withRouter } from "react-router-dom";

const mapModalTypeToContent = {
  [modalTypes.CONFIRM_ACTION]: ({ modalData }) => <ConfirmAction me={modalData} />,
  [modalTypes.CONFIRM_ACTION_WITH_REASON]: ({ modalData }) => <ConfirmActionWithReason me={modalData} />,
  [modalTypes.LOGIN]: ({ location }) => <Login pathname={location.pathname} />,
  [modalTypes.ON_BOARD]: () => <OnBoard />
};

const ModalContent = ({ modalData, location }) => {
  const mappedModal = mapModalTypeToContent[modalData.type];
  return mappedModal ? mappedModal({modalData, location}) : console.log("modal not mapped");
};

export default withRouter(ModalContent);
