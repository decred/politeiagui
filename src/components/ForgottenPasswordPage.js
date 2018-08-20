import React, { Component } from "react";
import ForgottenPassword from "./ForgottenPassword";
import qs from "query-string";

class ForgottenPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }

  componentWillMount() {
    const { email } = qs.parse(this.props.location.search);
    this.setState({ email });
  }

  render() {
    const { email } = this.state;
    return (
      <div className="content" role="main">
        <div className="page forgotten-password-page">
          <h1>Reset Password</h1>
          <ForgottenPassword {...{ email }}/>
        </div>
      </div>
    );
  }
}

export default ForgottenPasswordPage;
