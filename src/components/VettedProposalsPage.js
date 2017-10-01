import React, { Component } from "react";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import ProposalSummary from "./ProposalSummary";
import proposalsConnector from "../connectors/proposals";

class Proposals extends Component {
  componentDidMount() {
    this.props.onFetchData();
  }

  render() {
    const { isLoading, error, proposals } = this.props;
    return isLoading ? <LoadingPage /> : error ? <ErrorPage {...{ error }} /> : (
      <article className="page vetted-proposals-page">
        <h2>Proposals</h2>
        <ol className={"proposals-list"}>
          {proposals.map(proposal => console.log("proposal", proposal) || (
            <li className={"proposal"}>
              <ProposalSummary {...{ proposal }} />
            </li>
          ))}
        </ol>
      </article>
    );
  }
}

export default proposalsConnector(Proposals);
