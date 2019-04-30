import React, { Component } from "react";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import { warn } from "../validators/proposal";
import { validate, synchronousValidation } from "../validators/submit";
import { withRouter } from "react-router-dom";
import submit from "../connectors/submit";
import appConnector from "../connectors/app";

class SubmitFormContainer extends Component {
  componentDidMount() {
    this.props.policy || this.props.onFetchData();
  }

  render() {
    const Component = this.props.Component;
    return (
      <Component
        {...{
          ...this.props,
          onSaveDraft: this.onSaveDraft
        }}
      />
    );
  }

  onSaveDraft = (...args) => {
    validate(...args);
    this.props.onSaveDraft(...args);
    this.props.history.push("/user/proposals/drafts");
  };
}

const wrap = Component => props => (
  <SubmitFormContainer {...{ ...props, Component }} />
);

export default compose(
  submit,
  appConnector,
  withRouter,
  reduxForm({
    form: "form/record",
    touchOnChange: true,
    validate: synchronousValidation,
    enableReinitialize: true,
    warn
  }),
  wrap
);
