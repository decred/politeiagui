import React, { Component } from "react";
import { withRouter } from "react-router";
import { isEmpty } from "lodash";
import PageLoadingIcon from "../snew/PageLoadingIcon";
import verifyConnector from "../../connectors/verify";

class Verify extends Component {
  componentWillMount() {
    if (isEmpty(this.props.location.search)) {
      this.props.history.push("/user/login");
      return;
    }

    this.props.onVerify(this.props.location.search)
      .then(() => this.props.history.push("/user/verify/success"))
      .catch(err => {
        console.error(err.stack || err);
        this.props.history.push("/user/verify/failure");
      });
  }

  render() {
    return (
      <div className="verification-page">
        <PageLoadingIcon />
      </div>
    );
  }
}

export default verifyConnector(withRouter(Verify));
