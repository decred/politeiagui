import React from "react";
import PaywallPage from "./Page";
import paywallConnector from "../../connectors/paywall";

class Paywall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAttemptedSubmit: false,
      isHidden: false
    };
  }

  componentWillMount() {
    const {paywallAddress, paywallAmount} = this.props;
    if(!paywallAddress)
      return;
    this.props.getPaymentsByAddress(paywallAddress, paywallAmount);
  }

  componentWillReceiveProps(nextProps) {
    const {paywallAddress, paywallAmount} = nextProps;
    if(!paywallAddress)
      return;
    this.props.getPaymentsByAddress(paywallAddress, paywallAmount);
  }

  render() {
    const { hasAttemptedSubmit } = this.state;
    const { onSubmit } = this;
    const { grantAccess, paywallAddress, paywallAmount } = this.props;
    return paywallAddress && paywallAmount && (
      <PaywallPage
        {...{
          ...this.props,
          grantAccess,
          hasAttemptedSubmit,
          onSubmit,
        }}
      />
    );
  }

}

export default paywallConnector(Paywall);
