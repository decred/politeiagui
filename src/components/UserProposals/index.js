import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router-dom";
import userProposalsConnector from "../../connectors/userProposals";
import { Content as ProposalListing } from "../../components/snew";

class UserProposals extends Component {
  render() {
    return (
      <div className="page content">
        <ProposalListing {...this.props} />
      </div>
    );
  }
}

autobind(UserProposals);

export default userProposalsConnector(withRouter(UserProposals));
