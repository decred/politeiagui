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
      hasAttemptedSubmit: false,
      isHidden: false
    };
  }

  componentWillMount() {
    setInterval( () => {
      this.props.getPaymentsByAddress("TsRBnD2mnZX1upPMFNoQ1ckYr9Y4TZyuGTV", 0.1);
    }, 60000);
  }

  componentWillUnmount() {
    this.resetState();
  }

  render() {
    const { hasAttemptedSubmit, isHidden } = this.state;
    const { onSubmit, onCloseModal } = this;

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

  onCloseModal() {
    this.setState({isHidden: true});
  }

}

autobind(PayWallModal);

export default paywallConnector(PayWallModal);
