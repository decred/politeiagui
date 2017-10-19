import React, { Component } from "react";
import submitConnector from "../../connectors/submitProposal";
import LoadingPage from "../LoadingPage";
import SuccessPage from "./Success";
import proposalSuccessConnector from "../../connectors/proposalSuccess";

class ProposalSuccess extends Component {
  componentWillMount() {
    if (!this.props.token) {
      return this.props.history.push("/proposals/new");
    }
  }

  componentWillUnmount() {
    this.props.onResetProposal();
  }

  render() {
    const { token, isLoading, ...props } = this.props;
    return isLoading ? <LoadingPage /> : (
      <div className="page proposal-submit-page">
        {token ? <SuccessPage {...{ ...props, token }} /> : null}
      </div>
    );
  }
}

export default proposalSuccessConnector(submitConnector(ProposalSuccess));
