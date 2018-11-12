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

  render() {
    const { hasAttemptedSubmit } = this.state;
    const { onSubmit } = this;
    const { paywallAddress, paywallAmount } = this.props;
    return (
      paywallAddress &&
      paywallAmount && (
        <PaywallPage
          {...{
            ...this.props,
            hasAttemptedSubmit,
            onSubmit
          }}
        />
      )
    );
  }
}

export default paywallConnector(Paywall);
