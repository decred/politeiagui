import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router-dom";
import assign from "lodash/assign";
import { isRequiredValidator } from "../../validators";
import InviteUserForm from "./InviteUserForm";
import inviteConnector from "../../connectors/invite";
import validate from "./InviteUserValidator";
import { SubmissionError } from "redux-form";
import Message from "../Message";

const qs = require("querystring");

class InviteUser extends Component {
  constructor(props) {
    super(props);
    const query = this.getQueryParams();
    if (
      isRequiredValidator(query.email) &&
      isRequiredValidator(query.verificationtoken)
    ) {
      return;
    }
  }

  componentWillUnmount() {
    this.props.resetInviteUser();
  }

  componentDidUpdate() {
    if (this.props.inviteUserResponse) {
      this.props.history.push("/admin/invite/next");
    }
  }

  componentDidMount() {
    this.props.onFetchData();
  }

  render() {
    return this.props.loggedInAsEmail ? (
      <InviteUserForm
        {...{
          onInviteUser: this.onInviteUser,
          isRequesting: this.props.isRequesting
        }}
      />
    ) : (
      <div className="content">
        <Message
          type="error"
          header="Forbidden"
          body="This is an admin protected area. Please login to your account."
        />
      </div>
    );
  }

  getQueryParams() {
    return qs.parse(this.props.location.search);
  }

  onInviteUser(props) {
    const policy = this.props.policy;
    validate(props, policy);
    return this.props
      .onInviteUserConfirm(
        assign({ email: props.email }, this.getQueryParams())
      )
      .catch(error => {
        throw new SubmissionError({
          _error: error.message
        });
      });
  }
}

autobind(InviteUser);

export default inviteConnector(withRouter(InviteUser));
