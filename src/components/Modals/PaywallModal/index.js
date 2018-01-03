import React from "react";
import Modal from "../Modal";
import Paywall from "./Paywall";
import paywallConnector from "../../../connectors/paywall";

class PayWallModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      hasAttemptedSubmit: false,
      isHidden: false
    };
  }

  componentWillMount() {
    const {paywallAddress, paywallAmount} = this.props;
    this.props.getPaymentsByAddress(paywallAddress, paywallAmount);
  }

  componentWillUnmount() {
    this.resetState();
  }

  render() {
    const { hasAttemptedSubmit } = this.state;
    const { onSubmit } = this;
    const {isHidden, onCloseModal} = this.props;

    return (
      <Modal
        children={Paywall}
        isHidden={isHidden}
        {...{
          ...this.props,
          hasAttemptedSubmit,
          onSubmit,
          onCloseModal
        }}
      />
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  onSubmit() {

  }

}

export default paywallConnector(PayWallModal);
