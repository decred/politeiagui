import React, { Component } from "react";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import validate from "../validators/proposal-find";

class SearchWrapper extends Component {
  render() {
    const Component = this.props.Component;
    console.log("props", this.props);
    return <Component {...{...this.props, onFind: this.onFind.bind(this) }} />;
  }

  onFind({ censorship }) {
    this.props.history.push(`/proposals/${censorship}`);
  }
}

const wrapSearch = (Component) => (props) => <SearchWrapper {...{...props, Component }} />;

export default compose(withRouter, wrapSearch, reduxForm({ form: "form/proposal-find", validate }));
