import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { isEmpty } from "lodash";
import UnvettedList from "./List";
import unvettedConnector from "../../connectors/unvettedProposal";
import censoredConnector from "../../connectors/censoredProposals";
import unreviewedConnector from "../../connectors/unreviewedProposals";

class Proposals extends Component {
  componentWillMount() {
    if (isEmpty(this.props.proposals)) {
      this.props.onFetchData();
    }
  }

  render() {
    return (
      <div className="page admin-landing-page">
        {this.props.isLoading
          ? <div>Loading...</div>
          : <UnvettedList {...this.props} />}
      </div>
    );
  }
}




export const UnvettedProposals = withRouter(unvettedConnector(Proposals));
export const CensoredProposals = withRouter(censoredConnector(Proposals));
export const UnreviewedProposals = withRouter(unreviewedConnector(Proposals));
export default UnvettedProposals;
