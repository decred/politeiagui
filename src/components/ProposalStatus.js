import React, { Component } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import proposalStatusConnector from "../connectors/proposalStatus";
import { PROPOSAL_STATUS_CENSORED, PROPOSAL_STATUS_PUBLIC } from "../constants";

class ProposalStatus extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.newStatusProposal) {
      nextProps.history.goBack();
    }
  }

  render() {
    const { proposal } = this.props;

    return (
      <div className="proposal-status">
        <h4>Change status to</h4>
        <button onClick={() => this.props
          .onSubmitStatusProposal(proposal.censorshiprecord.token, PROPOSAL_STATUS_CENSORED)}
        >Censored</button>
        <button onClick={() => this.props
          .onSubmitStatusProposal(proposal.censorshiprecord.token, PROPOSAL_STATUS_PUBLIC)}
        >Publish</button>
      </div>
    );
  }
}

ProposalStatus.propTypes = {
  proposal: PropTypes.shape({
    name: PropTypes.string.isRequired,
    censorshiprecord: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default withRouter(proposalStatusConnector(ProposalStatus));
