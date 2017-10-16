import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { isEmpty } from "lodash";
import UnvettedList from "./List";
import unvettedConnector from "../../connectors/unvettedProposal";

class ProposalUnvetted extends Component {
  componentWillMount() {
    if (isEmpty(this.props.proposals)) {
      this.props.onFetchUnvetted();
    }
  }
  render() {
    if (isEmpty(this.props.proposals)) {
      return <div>Loading...</div>;
    }

    return (
      <UnvettedList proposals={this.props.proposals} />
    );
  }
}

export default unvettedConnector(withRouter(ProposalUnvetted));
