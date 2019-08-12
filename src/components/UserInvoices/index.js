import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router-dom";
import userInvoicesConnector from "../../connectors/userInvoices";
import { Content as ProposalListing } from "../../components/snew";
import Message from "../Message";

class UserInvoices extends Component {
  render() {
    return this.props.userInvoicesError ? (
      <Message
        type="error"
        header="Failed to fetch user invoices"
        body={this.props.userInvoicesError}
      />
    ) : (
      <div className="page content">
        <ProposalListing {...this.props} />
      </div>
    );
  }
}

autobind(UserInvoices);

export default userInvoicesConnector(withRouter(UserInvoices));
