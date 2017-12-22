import React from "react";
import {autobind} from "core-decorators";
import Modal from "../Modal";
import Paywall from "./Paywall";

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

export default PayWallModal;
