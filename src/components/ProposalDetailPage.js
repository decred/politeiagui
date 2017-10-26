import React, { Component } from "react";
import LoadingPage from "./LoadingPage";
import ProposalImages from "./ProposalImages";
import ProposalStatus from "./ProposalStatus";
import ErrorPage from "./ErrorPage";
import Markdown from "./MarkdownRenderer";
import proposalConnector from "../connectors/proposal";
import { getProposalStatus } from "../helpers";

class ProposalDetailPage extends Component {
  componentDidMount() {
    this.props.onFetchData(this.props.token);
  }

  render() {
    const { isLoading, isAdmin, error, proposal, markdownFile, otherFiles } = this.props;

    return isLoading ? <LoadingPage /> : error ? <ErrorPage {...{ error }} /> : (
      <div className="page proposal-detail-page">
        {isAdmin && <ProposalStatus proposal={proposal} />}
        <h2>{proposal.name}</h2>
        <div className="proposal-meta-data clearfloat">
          <div className="proposal-meta-data-name">Created:</div>
          <div className="proposal-meta-data-value">{(new Date(proposal.timestamp * 1000)).toString()}</div>
        </div>
        <div className="proposal-meta-data clearfloat">
          <div className="proposal-meta-data-name">Status:</div>
          <div className="proposal-meta-data-value">{getProposalStatus(proposal.status)}</div>
        </div>
        <hr />
        <Markdown value={markdownFile ? atob(markdownFile.payload) : ""} />
        <hr/>
        <ProposalImages readOnly files={otherFiles} />
      </div>
    );
  }
}

export default proposalConnector(ProposalDetailPage);
