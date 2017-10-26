import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import SubmitPage from "./Page";
import validate from "./validator";

class FindProposal extends Component {
  constructor() {
    super();

    this.onFind = this.onFind.bind(this);
  }

  onFind(props) {
    validate(props);
    this.props.history.push(`/proposals/${props.censorship}`);
  }

  render() {
    return (
      <div className="page proposal-find-page">
        <SubmitPage {...this.props} onFind={this.onFind} />
      </div>
    );
  }
}

export default withRouter(FindProposal);
