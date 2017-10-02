import React, { Component } from "react";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import Markdown from "./MarkdownRenderer";
import proposalConnector from "../connectors/proposal";

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
        <div>
          Created {(new Date(proposal.timestamp * 1000)).toString()}
        </div>
        <hr />
        <Markdown value={proposal.files && proposal.files.length > 0 ? atob(proposal.files[0].payload) : ""} />
      </div>
    );
  }
}

export default proposalConnector(ProposalDetailPage);
