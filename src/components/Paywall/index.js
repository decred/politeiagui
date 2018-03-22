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
    const {paywallAddress, paywallAmount, paywallTxNotBefore, loggedIn} = this.props;
    if(!paywallAddress || !loggedIn)
      return;
    this.props.verifyUserPayment(paywallAddress, paywallAmount, paywallTxNotBefore);
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
