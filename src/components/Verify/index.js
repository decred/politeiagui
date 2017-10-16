import React, { Component } from "react";
import { withRouter } from "react-router";
import { isEmpty } from "lodash";
import verifyConnector from "../../connectors/verify";

class Verify extends Component {
  componentWillMount() {
    if (isEmpty(this.props.location.search)) {
      this.props.history.push("/user/login");
      return;
    }

    this.props.onVerify(this.props.location.search);
  }

  render() {
    return (
      <div className="verification-page">
        Processing...
      </div>
    );
  }
}

export default verifyConnector(withRouter(Verify));
