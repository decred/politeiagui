import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as sel from "../selectors";
import * as act from "../actions";
import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import { validate } from "../validators/proposal";
import { arg, or } from "../lib/fp";

const submitConnector = connect(
  sel.selectorMap({
    token: compose(
      t => (t ? t.toLowerCase() : t),
      get(["match", "params", "token"]),
      arg(1)
    ),
    editedProposalToken: sel.editProposalToken,
    submitError: sel.apiEditProposalError,
    proposal: sel.proposal,
    initialValues: or(sel.getEditProposalValues),
    isLoading: or(sel.isLoadingSubmit, sel.proposalIsRequesting),
    loggedInAsEmail: sel.loggedInAsEmail,
    userCanExecuteActions: sel.userCanExecuteActions,
    policy: sel.policy,
    userid: sel.userid,
    username: sel.loggedInAsUsername,
    keyMismatch: sel.getKeyMismatch,
    proposalCredits: sel.proposalCredits,
    draftProposalById: sel.draftProposalById,
    isApiRequestingMe: sel.isApiRequestingMe
  }),
  {
    onFetchData: act.onGetPolicy,
    onFetchProposal: act.onFetchProposal,
    onResetProposal: act.onResetProposal,
    onSave: act.onEditProposal,
    onSaveDraft: act.onSaveDraftProposal,
    onDeleteDraft: act.onDeleteDraftProposal
  }
);

class SubmitWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validationError: ""
    };
  }
  componentDidMount() {
    const { token } = this.props;
    this.props.policy || this.props.onFetchData();
    this.props.onFetchProposal && this.props.onFetchProposal(token);
  }

  componentDidUpdate() {
    const { editedProposalToken, proposal, isApiRequestingMe } = this.props;
    if (editedProposalToken) {
      this.props.onResetProposal();
      return this.props.history.push("/proposals/" + editedProposalToken);
    }

    const isProposalFetched =
      proposal &&
      proposal.censorshiprecord &&
      proposal.censorshiprecord.token === this.props.token;
    const proposalBelongsToTheUser =
      proposal && proposal.userid === this.props.userid;
    if (isProposalFetched && !proposalBelongsToTheUser && !isApiRequestingMe) {
      this.props.history.push("/");
    }
  }

  render() {
    const Component = this.props.Component;
    return (
      <Component
        {...{
          ...this.props,
          validationError: this.state.validationError,
          editingMode: true,
          onSave: this.onSave
        }}
      />
    );
  }

  onSave = (...args) => {
    try {
      validate(...args);
      this.props.onSave(...args, this.props.token);
    } catch (e) {
      this.setState({ validationError: e.errors._error });
    }
  };
}

const wrapSubmit = Component => props => (
  <SubmitWrapper {...{ ...props, Component }} />
);

export default compose(
  submitConnector,
  withRouter,
  wrapSubmit
);
