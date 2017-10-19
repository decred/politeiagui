import React, { Component } from "react";
import LoadingPage from "./LoadingPage";
import ProposalImages from "./ProposalImages";
import ErrorPage from "./ErrorPage";
import Markdown from "./MarkdownRenderer";
import proposalConnector from "../connectors/proposal";
import { getProposalStatus } from "../helpers";

class ProposalDetailPage extends Component {
  componentDidMount() {
    this.props.onFetchData(this.props.token);
  }

  willReceiveProps(nextProps) {
    if (nextProps.token !== this.props.token) {
      nextProps.onFetchData(nextProps.token);
    }
  }

  render() {
    const { isLoading, error, proposal } = this.props;

    return isLoading ? <LoadingPage /> : error ? <ErrorPage {...{ error }} /> : (
      <div className="page proposal-detail-page">
        <h2>{proposal.name}</h2>
        <div className="proposal-meta-data">
          <div className="proposal-meta-data-name">Created:</div>
          <div className="proposal-meta-data-value">{(new Date(proposal.timestamp * 1000)).toString()}</div>
        </div>
        <div className="proposal-meta-data">
          <div className="proposal-meta-data-name">Status:</div>
          <div className="proposal-meta-data-value">{getProposalStatus(proposal.status)}</div>
        </div>
        <hr />
        <Markdown value={proposal.files && proposal.files.length > 0 ? atob(proposal.files[0].payload) : ""} />
        <hr/>
        <ProposalImages files={proposal && proposal.files ? proposal.files.slice(1) : []} />
      </div>
    );
  }
}

export default proposalConnector(ProposalDetailPage);
