import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import compose from "lodash/fp/compose";
import { or } from "../lib/fp";
import { reduxForm } from "redux-form";
import validate from "../validators/proposal";
import { withRouter } from "react-router-dom";

const submitConnector = connect(
  sel.selectorMap({
    isLoading: or(sel.isLoadingSubmit, sel.newProposalIsRequesting),
    loggedInAs: sel.loggedInAs,
    policy: sel.policy,
    name: sel.newProposalName,
    description: sel.newProposalDescription,
    files: sel.newProposalFiles,
    newProposalError: sel.newProposalError,
    merkle: sel.newProposalMerkle,
    token: sel.newProposalToken,
    signature: sel.newProposalSignature
  }),
  {
    onFetchData: act.onGetPolicy,
    onSave: act.onSaveNewProposal,
    onResetProposal: act.onResetProposal
  }
);


class SubmitWrapper extends Component {
  componentDidMount() {
    this.props.policy || this.props.onFetchData();
  }

  componentWillReceiveProps({ token }) {
    if (token) {
      this.props.onResetProposal();
      return this.props.history.push("/proposals/" + token);
    }
  }

  render() {
    const Component = this.props.Component;
    return <Component {...{...this.props, onSave: this.onSave.bind(this) }}  />;
  }

  onSave(...args) {
    validate(...args);
    return this.props.onSave(...args);
  }
}

const wrapSubmit = (Component) => (props) => <SubmitWrapper {...{...props, Component }} />;

export default compose(withRouter, submitConnector, reduxForm({ form: "form/proposal" }), wrapSubmit);
