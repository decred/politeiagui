import React, { Component } from "react";
import ProposalCreditsPage from "./Page";
import proposalCreditsConnector from "../../connectors/proposalCredits";

class ProposalCreditsManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numCreditsToPurchase: 1
    };
  }

  onUpdateCreditsToPurchase = event => {
    const numCreditsToPurchase = parseInt(event.target.value, 10);
    if (numCreditsToPurchase < 1) {
      return;
    }

    this.setState({ numCreditsToPurchase });
  };

  render() {
    const { numCreditsToPurchase } = this.state;
    const { onUpdateCreditsToPurchase } = this;
    return (
      <ProposalCreditsPage
        {...{
          ...this.props,
          numCreditsToPurchase,
          onUpdateCreditsToPurchase
        }}
      />
    );
  }
}

export default proposalCreditsConnector(ProposalCreditsManager);
