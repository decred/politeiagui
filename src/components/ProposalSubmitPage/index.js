import React, { Component } from "react";
import submitConnector from "../../connectors/submitProposal";
import { SubmitPage, Loading } from "../snew";

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
    return this.props.isLoading  || !this.props.policy ? <Loading /> : <SubmitPage />;
  }
}

export default submitConnector(ProposalSubmit);
