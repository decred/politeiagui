import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import compose from "lodash/fp/compose";
import { or } from "../lib/fp";
import { reduxForm } from "redux-form";
import { validate, synchronousValidation, warn } from "../validators/proposal";
import { withRouter } from "react-router-dom";
import { getNewProposalData } from "../lib/editors_content_backup";
import { getDraftByNameFromLocalStorage } from "../lib/local_storage";

const submitConnector = connect(
  sel.selectorMap({
    initialValues: or(getDraftByNameFromLocalStorage, getNewProposalData),
    isLoading: or(sel.isLoadingSubmit, sel.newProposalIsRequesting),
    loggedInAsEmail: sel.loggedInAsEmail,
    userCanExecuteActions: sel.userCanExecuteActions,
    policy: sel.policy,
    userid: sel.userid,
    username: sel.loggedInAsUsername,
    keyMismatch: sel.getKeyMismatch,
    name: sel.newProposalName,
    description: sel.newProposalDescription,
    files: sel.newProposalFiles,
    newProposalError: sel.newProposalError,
    merkle: sel.newProposalMerkle,
    token: sel.newProposalToken,
    savedDraft: sel.newDraftSaved,
    signature: sel.newProposalSignature
  }),
  {
    onFetchData: act.onGetPolicy,
    onSave: act.onSaveNewProposal,
    onResetProposal: act.onResetProposal,
    onSaveDraft: act.onSaveDraftProposal,
    onResetDraftProposal: act.onResetDraftProposal,
  }
);


class SubmitWrapper extends Component {

  componentDidMount() {
    this.props.policy || this.props.onFetchData();
  }

  componentWillReceiveProps({ token, savedDraft }) {
    if (token) {
      this.props.onResetProposal();
      return this.props.history.push("/proposals/" + token);
    }
    if (savedDraft) {
      this.props.onResetProposal();
      this.props.onResetDraftProposal();
      return this.props.history.push("/");
    }
  }

  render() {
    const Component = this.props.Component;
    return <Component {...{...this.props,
      onSave: this.onSave.bind(this),
      onSaveDraft: this.onSaveDraft.bind(this)
    }}  />;
  }

  onSave(...args) {
    validate(...args);
    return this.props.onSave(...args);
  }

  onSaveDraft(...args) {
    validate(...args);
    return this.props.onSaveDraft(...args);
  }
}

const wrapSubmit = (Component) => (props) => <SubmitWrapper {...{...props, Component }} />;

export default compose(withRouter, submitConnector, reduxForm({ form: "form/proposal", touchOnChange: true, validate: synchronousValidation, warn }), wrapSubmit);
