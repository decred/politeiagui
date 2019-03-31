import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router-dom";
import userInvoicesConnector from "../../connectors/userInvoices";
import { Content as ProposalListing } from "../../components/snew";

class UserInvoices extends Component {
  render() {
    return (
      <div className="page content">
        <ProposalListing {...this.props} />
      </div>
    );
  }
}

autobind(UserInvoices);

export default userInvoicesConnector(withRouter(UserInvoices));
