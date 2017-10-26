import React, { Component } from "react";
import { withRouter } from "react-router";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import proposalStatusConnector from "../connectors/proposalStatus";
import proposalConnector from "../connectors/proposal";
import { PROPOSAL_STATUS_CENSORED, PROPOSAL_STATUS_PUBLIC } from "../constants";

class ProposalStatusPage extends Component {
  componentWillMount() {
    this.props.onFetchData(this.props.token);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newStatusProposal) {
      nextProps.history.goBack();
    }
  }

  render() {
    const { isLoading, error, proposal } = this.props;

    return isLoading ? <LoadingPage /> : error ? <ErrorPage {...{ error }} /> : (
      <div>
        <div className="page proposal-status-page">
          {proposal.name}
          <h4>Change status to</h4>
          <button onClick={() => this.props
            .onSubmitStatusProposal(proposal.censorshiprecord.token, PROPOSAL_STATUS_CENSORED)}
          >Censored</button>
          <button onClick={() => this.props
            .onSubmitStatusProposal(proposal.censorshiprecord.token, PROPOSAL_STATUS_PUBLIC)}
          >Publish</button>
        </div>
      </div>
    );
  }
}

export default withRouter(proposalConnector(proposalStatusConnector(ProposalStatusPage)));
