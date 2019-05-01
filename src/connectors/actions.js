import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const actions = connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    email: sel.email,
    userid: sel.userid,
    isAdmin: sel.isAdmin,
    userHasPaid: sel.userHasPaid,
    userCanExecuteActions: sel.userCanExecuteActions,
    lastSubmitted: sel.getLastSubmittedProposal,
    setStatusProposalToken: sel.setStatusProposalToken,
    setStatusProposalError: sel.setStatusProposalError,
    authorizeVoteError: sel.apiAuthorizeVoteError,
    getVoteStatus: sel.getPropVoteStatus,
    authorizeVoteToken: sel.apiAuthorizeVoteToken,
    userPaywallStatus: sel.getUserPaywallStatus,
    isRequestingAuthorizeVote: sel.isApiRequestingAuthorizeVote,
    startVoteToken: sel.apiStartVoteToken,
    isRequestingStartVote: sel.isApiRequestingStartVote,
    isApiRequestingSetProposalStatusByToken:
      sel.isApiRequestingSetProposalStatusByToken,
    startVoteError: sel.apiStartVoteError
  }),
  {
    onChangeStatus: act.onSetProposalStatus,
    onDeleteDraftProposal: act.onDeleteDraftProposal,
    onStartVote: act.onStartVote,
    onAuthorizeVote: act.onAuthorizeVote,
    onRevokeVote: act.onRevokeVote,
    openModal: act.openModal
  }
);

export default actions;
