import React, { Component } from "react";
import { withRouter } from "react-router";
import { isEmpty } from "lodash";
import qs from "query-string";
import VerifyPage from "./Page";
import verifyConnector from "../../connectors/verify";

class Verify extends Component {
  componentWillMount() {
    const { verificationtoken, email } = qs.parse(this.props.location.search);
    if (isEmpty(this.props.location.search)
      || !email || !verificationtoken
      || typeof(email) !== "string" || typeof(verificationtoken) !== "string"
    ) {
      this.props.history.push("/user/login");
      return;
    }

    this.props.onVerify(this.props.location.search)
      .catch(err => {
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
