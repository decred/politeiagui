import React from "react";
import * as modalTypes from "./modalTypes";
import ConfirmAction from "./contents/ConfirmAction";

const mapModalTypeToContent = {
  [modalTypes.CONFIRM_ACTION]: (data) => <ConfirmAction me={data} />
};

const ModalContent = ({ modalData }) => {
  const mappedModal = mapModalTypeToContent[modalData.type];
  return mappedModal ? mappedModal(modalData) : console.log("modal not mapped");
};

export default ModalContent;
