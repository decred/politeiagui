import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import submitConnector from "../../connectors/submitProposal";
import LoadingPage from "../LoadingPage";
import SubmitPage from "./Page";

class ProposalSubmit extends Component {
  componentDidMount() {
    this.props.onFetchData();
  }

  componentWillReceiveProps({ token }) {
    if (token) {
      return this.props.history.push("/proposals/success");
    }
  }

  render() {
    const { isLoading, ...props } = this.props;

    return isLoading ? <LoadingPage /> : (
      <div className="page proposal-submit-page">
        {<SubmitPage {...props} />}
      </div>
    );
  }
}

export default withRouter(submitConnector(ProposalSubmit));
