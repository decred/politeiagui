import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import Paywall from "../../Paywall";

const PaywallModal = ({ closeModal }) => (
  <ModalContentWrapper
    title={"Complete your registration"}
    onClose={closeModal}
  >
    <Paywall />
  </ModalContentWrapper>
);

export default modalConnector(PaywallModal);
