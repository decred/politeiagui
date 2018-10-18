import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import { validate, synchronousValidation, warn } from "../validators/proposal";
import { withRouter } from "react-router-dom";

const submitConnector = connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    userCanExecuteActions: sel.userCanExecuteActions,
    policy: sel.policy,
    userid: sel.userid,
    username: sel.loggedInAsUsername,
    keyMismatch: sel.getKeyMismatch,
    proposalCredits: sel.proposalCredits
  }),
  {
    onFetchData: act.onGetPolicy,
    openModal: act.openModal,
    onResetProposal: act.onResetProposal,
    onSaveDraft: act.onSaveDraftProposal,
    onDeleteDraft: act.onDeleteDraftProposal
  }
);

class SubmitWrapper extends Component {

  componentDidMount() {
    this.props.policy || this.props.onFetchData();
  }

  render() {
    const Component = this.props.Component;
    return <Component { ...{ ...this.props,
      onSaveDraft: this.onSaveDraft
    }}  />;
  }

  onSaveDraft = (...args) => {
    validate(...args);
    this.props.onSaveDraft(...args);
    this.props.history.push("/user/proposals/drafts");
  }
}

const wrapSubmit = (Component) => (props) => <SubmitWrapper { ...{ ...props, Component }} />;

export default compose(
  withRouter,
  submitConnector,
  reduxForm({
    form: "form/proposal",
    touchOnChange: true,
    validate: synchronousValidation,
    enableReinitialize: true,
    warn
  }),
  wrapSubmit
);
