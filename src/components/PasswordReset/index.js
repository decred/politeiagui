import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router";
import qs from "query-string";
import { assign } from "lodash";
import { isRequiredValidator } from "../../validators";
import PasswordResetForm from "./PasswordResetForm";
import passwordResetConnector from "../../connectors/passwordReset";

class PasswordReset extends Component {
  componentWillMount() {
    const query = this.getQueryParams();

    if (isRequiredValidator(query.email) && isRequiredValidator(query.verificationtoken)) {
      return;
    }

    this.props.history.push("/");
  }

  componentWillUnmount() {
    this.props.resetPasswordReset();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.passwordResetResponse) {
      nextProps.history.push("/user/password/reset/next");
    }
  }

  render() {
    return (
      <div className="password-reset-form">
        <PasswordResetForm {...{
          onPasswordReset: this.onPasswordReset,
          isRequesting: this.props.isRequesting,
        }} />
      </div>
    );
  }

  getQueryParams() {
    return qs.parse(this.props.location.search);
  }

  onPasswordReset({ password }) {
    this.props.onPasswordResetRequest(assign({ password }, this.getQueryParams()));
  }
}

autobind(PasswordReset);

export default passwordResetConnector(withRouter(PasswordReset));
