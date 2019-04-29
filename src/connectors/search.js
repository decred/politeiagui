import React, { Component } from "react";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import validate from "../validators/proposal-find";

class SearchWrapper extends Component {
  render() {
    const Component = this.props.Component;
    return <Component {...{ ...this.props, onFind: this.onFind.bind(this) }} />;
  }

  onFind(...args) {
    validate(...args);
    this.props.history.push(`/proposals/${args[0].censorship}`);
  }
}

const wrapSearch = Component => props => (
  <SearchWrapper {...{ ...props, Component }} />
);

export default compose(
  withRouter,
  reduxForm({ form: "form/record-find" }),
  wrapSearch
);
