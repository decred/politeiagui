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
    const { hasPaid} = this.props;

    return (
      <PaywallPage
        {...{
          ...this.props,
          hasPaid,
          hasAttemptedSubmit,
          onSubmit,
        }}
      />
    );
  }

}

export default paywallConnector(Paywall);
