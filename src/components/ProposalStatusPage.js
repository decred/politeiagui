import React, { Component } from "react";
import { isEmpty } from "lodash";
import { withRouter } from "react-router";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import proposalStatusConnector from "../connectors/proposalStatus";
import proposalConnector from "../connectors/proposal";

class ProposalStatusPage extends Component {
  componentWillMount() {
    if (isEmpty(this.props.proposal)) {
      this.props.onFetchData(this.props.token);
    }
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
          <button onClick={() => this.props.onSubmitStatusProposal(proposal.censorshiprecord.token, 3)}>Censored</button>
          <button onClick={() => this.props.onSubmitStatusProposal(proposal.censorshiprecord.token, 4)}>Publish</button>
        </div>
      </div>
    );
  }
}

export default withRouter(proposalConnector(proposalStatusConnector(ProposalStatusPage)));
