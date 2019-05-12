import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

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
    onSaveProposalDraft: act.onSaveDraftProposal,
    onSaveInvoiceDraft: act.onSaveDraftInvoice,
    onDeleteDraft: act.onDeleteDraftProposal,
    onDeleteDraftInvoice: act.onDeleteDraftInvoice
  }
);

export default submitConnector;
