import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import compose from "lodash/fp/compose";
import { or } from "../lib/fp";
import { validate } from "../validators/proposal";
import { getNewProposalData } from "../lib/editors_content_backup";

const newProposalConnector = connect(
  sel.selectorMap({
    initialValues: or(sel.draftProposalById, getNewProposalData),
    isLoading: or(sel.isLoadingSubmit, sel.newProposalIsRequesting),
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
    signature: sel.newProposalSignature,
    proposalCredits: sel.proposalCredits,
    draftProposalById: sel.draftProposalById
  }),
  {
    onFetchData: act.onGetPolicy,
    onSave: act.onSaveNewProposal,
    onResetProposal: act.onResetProposal,
    onSaveDraft: act.onSaveDraftProposal,
    onDeleteDraft: act.onDeleteDraftProposal
  }
);

class NewProposalWrapper extends Component {

  componentWillReceiveProps({ token }) {
    if (token) {
      if (this.props.draftProposalById) {
        this.props.onDeleteDraft(this.props.draftProposalById.draftId);
      }
      this.props.onResetProposal();
      return this.props.history.push("/proposals/" + token);
    }
  }

  render() {
    const Component = this.props.Component;
    return <Component { ...{ ...this.props,
      onSave: this.onSave
    }}
    />;
  }


  onSave = (...args) => {
    validate(...args);
    return this.props.onSave(...args);
  }
}

const wrap = (Component) => (props) => <NewProposalWrapper { ...{ ...props, Component }} />;

export default compose(
  newProposalConnector,
  wrap
);
