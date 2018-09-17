import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import Paywall from "../../Paywall";

class PaywallModal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { closeModal } = this.props;
    return (
      <ModalContentWrapper
        title={"Complete your registration"}
        onClose={closeModal}
        style={{ height: "calc(100vh - 100px)" }}
      >
        <Paywall />
      </ModalContentWrapper>
    );
  }
}

export default modalConnector(PaywallModal);
