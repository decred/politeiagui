import React, { Component } from "react";
import qs from "query-string";
import ForgottenPassword from "./ForgottenPassword";

class ForgottenPasswordPage extends Component {
  constructor(props) {
    super(props);
    const { email } = qs.parse(props.location.search);
    this.state = {
      email: email
    };
  }

  render() {
    const { email } = this.state;
    return (
      <div className="content" role="main">
        <div className="page forgotten-password-page">
          <h1>Reset Password</h1>
          <ForgottenPassword {...{ email }} />
        </div>
      </div>
    );
  }
}

export default ForgottenPasswordPage;
