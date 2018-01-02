import React from "react";
import {autobind} from "core-decorators";
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
      hasAttemptedSubmit: false
    };
  }

  componentWillMount() {
    this.props.getPaymentsByAddress();
  }

  componentWillUnmount() {
    this.resetState();
  }

  render() {
    const { hasAttemptedSubmit } = this.state;
    const { onSubmit } = this;

    return (
      <Modal
        children={Paywall}
        isHidden={false}
        {...{
          ...this.props,
          hasAttemptedSubmit,
          onSubmit
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

autobind(PayWallModal);

export default paywallConnector(PayWallModal);
