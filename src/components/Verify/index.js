import React, { Component } from "react";
import { withRouter } from "react-router";
import { isEmpty } from "lodash";
import VerifyPage from "./Page";
import verifyConnector from "../../connectors/verify";

class Verify extends Component {
  componentWillMount() {
    if (isEmpty(this.props.location.search)) {
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
