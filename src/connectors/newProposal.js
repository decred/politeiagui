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
    draftProposal: sel.draftProposalById,
    isLoading: or(sel.isLoadingSubmit, sel.newProposalIsRequesting),
    policy: sel.policy,
    userid: sel.userid,
    username: sel.loggedInAsUsername,
    keyMismatch: sel.getKeyMismatch,
    name: sel.newProposalName,
    description: sel.newProposalDescription,
    files: sel.newProposalFiles,
    submitError: sel.newProposalError,
    merkle: sel.newProposalMerkle,
    token: sel.newProposalToken,
    signature: sel.newProposalSignature,
    proposalCredits: sel.proposalCredits,
    draftProposalById: sel.draftProposalById,
    userPaywallStatus: sel.getUserPaywallStatus,
    userHasPaid: sel.userHasPaid
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
  constructor(props) {
    super(props);
    this.state = {
      initialValues: props.draftProposal || getNewProposalData(),
      validationError: ""
    };
  }

  componentDidUpdate(prevProps) {
    const { token, draftProposal } = this.props;
    if (token) {
      if (this.props.draftProposalById) {
        this.props.onDeleteDraft(this.props.draftProposalById.draftId);
      }
      this.props.onResetProposal();
      return this.props.history.push("/proposals/" + token);
    }

    const draftProposalDataAvailable =
      !prevProps.draftProposal && draftProposal;
    if (draftProposalDataAvailable) {
      this.setState({
        initialValues: draftProposal
      });
    }
  }

  render() {
    const { Component } = this.props;
    const { validationError } = this.state;
    return (
      <Component
        {...{
          ...this.props,
          onSave: this.onSaveProposal.bind(this),
          initialValues: this.state.initialValues,
          validationError: validationError,
          onChange: this.onChange
        }}
      />
    );
  }

  onChange = () => {
    this.setState({ validationError: "" });
  };

  onSaveProposal = (...args) => {
    try {
      validate(...args);
    } catch (e) {
      this.setState({ validationError: e.errors._error });
      return;
    }
    return this.props.onSave(...args);
  };
}

const wrap = Component => props => (
  <NewProposalWrapper {...{ ...props, Component }} />
);

export default compose(
  newProposalConnector,
  wrap
);
