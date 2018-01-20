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
    this.props.getPaymentsByAddress(paywallAddress, paywallAmount);
  }

  componentWillUnmount() {
    this.resetState();
  }

  render() {
    const { hasAttemptedSubmit } = this.state;
    const { onSubmit } = this;
    const { grantAccess} = this.props;

    return (
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
