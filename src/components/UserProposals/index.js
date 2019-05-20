import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router-dom";
import userProposalsConnector from "../../connectors/userProposals";
import { Content as ProposalListing } from "../../components/snew";
import { LIST_HEADER_USER } from "../../constants";

class UserProposals extends Component {
  render() {
    return (
      <div className="page content">
        <ProposalListing
          header={LIST_HEADER_USER}
          emptyProposalsMessage="You have not created any proposals yet"
          {...this.props}
        />
      </div>
    );
  }
}

autobind(UserProposals);

export default userProposalsConnector(withRouter(UserProposals));
