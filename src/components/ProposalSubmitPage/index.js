import React, { Component } from "react";
import submitConnector from "../../connectors/submitProposal";
import LoadingPage from "../LoadingPage";
import SubmitPage from "./Page";
import SuccessPage from "./Success";

class ProposalSubmit extends Component {
  componentDidMount() {
    this.props.onFetchData();
  }

  render() {
    const { token, isLoading, ...props } = this.props;
    return isLoading ? <LoadingPage /> : (
      <div className="page proposal-submit-page">
        {token
          ? <SuccessPage {...{ ...props, token }} />
          : <SubmitPage {...props} />}
      </div>
    );
  }
}

export default submitConnector(ProposalSubmit);
