import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router-dom";
import assign from "lodash/assign";
import qs from "query-string";
import { isRequiredValidator } from "../../validators";
import PasswordResetForm from "./PasswordResetForm";
import passwordResetConnector from "../../connectors/passwordReset";
import validate from "./PasswordResetValidator";
import { SubmissionError } from "redux-form";

class PasswordReset extends Component {
  constructor(props) {
    super(props);
    const query = this.getQueryParams();
    if (
      isRequiredValidator(query.email) &&
      isRequiredValidator(query.verificationtoken)
    ) {
      return;
    }
    props.history.push("/");
  }

  componentWillUnmount() {
    this.props.resetPasswordReset();
  }

  componentDidUpdate() {
    if (this.props.passwordResetResponse) {
      this.props.history.push("/user/password/reset/next");
    }
  }

  componentDidMount() {
    this.props.onFetchData();
  }

  render() {
    return (
      <PasswordResetForm
        {...{
          onPasswordReset: this.onPasswordReset,
          isRequesting: this.props.isRequesting
        }}
      />
    );
  }

  getQueryParams() {
    return qs.parse(this.props.location.search);
  }

  onPasswordReset(props) {
    const policy = this.props.policy;
    validate(props, policy);

    return this.props
      .onPasswordResetRequest(
        assign({ newpassword: props.newPassword }, this.getQueryParams())
      )
      .catch(error => {
        throw new SubmissionError({
          _error: error.message
        });
      });
  }
}

autobind(PasswordReset);

export default passwordResetConnector(withRouter(PasswordReset));
