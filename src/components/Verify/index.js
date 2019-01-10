import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import isEmpty from "lodash/isEmpty";
import VerifyPage from "./Page";
import verifyConnector from "../../connectors/verify";

class Verify extends Component {
  constructor(props) {
    super(props);
    const { verificationtoken, email } = qs.parse(props.location.search);
    if (
      isEmpty(props.location.search) ||
      !email ||
      !verificationtoken ||
      typeof email !== "string" ||
      typeof verificationtoken !== "string"
    ) {
      props.history.push("/user/login");
      return;
    }

    props.onVerify(email, verificationtoken).catch(err => {
      console.error(err.stack || err);
    });
  }

  render() {
    return (
      <div className="content" role="main">
        <VerifyPage {...this.props} />
      </div>
    );
  }
}

export default verifyConnector(withRouter(Verify));
