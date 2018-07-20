import React from "react";
import * as modalTypes from "./modalTypes";
import ConfirmAction from "./contents/ConfirmAction";
import Login from "./contents/Login";
import ConfirmCensor from "./contents/ConfirmCensor";
import { withRouter } from "react-router-dom";

const mapModalTypeToContent = {
  [modalTypes.CONFIRM_ACTION]: ({ modalData }) => <ConfirmAction me={modalData} />,
  [modalTypes.LOGIN]: ({ location }) => <Login pathname={location.pathname} />,
  [modalTypes.CONFIRM_CENSOR]: ({ modalData }) => <ConfirmCensor me={modalData} />
};

const ModalContent = ({ modalData, location }) => {
  const mappedModal = mapModalTypeToContent[modalData.type];
  return mappedModal ? mappedModal({modalData, location}) : console.log("modal not mapped");
};

export default withRouter(ModalContent);
