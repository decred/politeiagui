import React from "react";
import { Modal } from "pi-ui";
import PrivacyPolicy from "../Static/PrivacyPolicy";

function PrivacyPolicyModal(props) {
  return (
    <Modal {...props}>
      <PrivacyPolicy />
    </Modal>
  );
}

export default PrivacyPolicyModal;
