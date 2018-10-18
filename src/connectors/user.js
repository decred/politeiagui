import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg, or } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";
import {
  EDIT_USER_CLEAR_USER_PAYWALL,
  EDIT_USER_EXPIRE_NEW_USER_VERIFICATION,
  EDIT_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  EDIT_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
  EDIT_USER_UNLOCK,
  EDIT_USER_LOCK
} from "../constants";

export default connect(
  sel.selectorMap({
    userId: compose(
      get([ "match", "params", "userId" ]),
      arg(1)
    ),
    loggedInAsUserId: sel.userid,
    user: sel.user,
    error: sel.apiUserError,
    isLoading: or(sel.isApiRequestingUser, sel.isApiRequestingMe),
    isLoadingProposals: or(sel.userProposalsIsRequesting, sel.isApiRequestingPropsVoteStatus),
    isTestnet: sel.isTestNet,
    loggedInAsEmail: sel.loggedInAsEmail,
    userProposals: sel.getUserProposals,
    isAdmin: sel.isAdmin,
    lastLoadedUserDetailProposal: sel.lastLoadedUserDetailProposal,
    lastLoadedProposal: sel.lastLoadedUserProposal,
    getSubmittedUserProposals: sel.getSubmittedUserProposals,
    isApiRequestingMarkAsPaid: state => (
      sel.isApiRequestingEditUser(state) && sel.editUserAction(state) === EDIT_USER_CLEAR_USER_PAYWALL
    ),
    isApiRequestingMarkNewUserAsExpired: state => (
      sel.isApiRequestingEditUser(state) && sel.editUserAction(state) === EDIT_USER_EXPIRE_NEW_USER_VERIFICATION
    ),
    isApiRequestingMarkUpdateKeyAsExpired: state => (
      sel.isApiRequestingEditUser(state) && sel.editUserAction(state) === EDIT_USER_EXPIRE_UPDATE_KEY_VERIFICATION
    ),
    isApiRequestingMarkResetPasswordAsExpired: state => (
      sel.isApiRequestingEditUser(state) && sel.editUserAction(state) === EDIT_USER_EXPIRE_RESET_PASSWORD_VERIFICATION
    ),
    isApiRequestingUnlockUser: state => (
      sel.isApiRequestingEditUser(state) && sel.editUserAction(state) === EDIT_USER_UNLOCK
    ),
    isApiRequestingLockUser: state => (
      sel.isApiRequestingEditUser(state) && sel.editUserAction(state) === EDIT_USER_LOCK
    ),
    editUserResponse: sel.editUserResponse
  }),
  dispatch => bindActionCreators({
    onFetchUserProposals: act.onFetchUserProposals,
    onFetchProposalsVoteStatus: act.onFetchProposalsVoteStatus,
    onFetchData: act.onFetchUser,
    onEditUser: act.onEditUser
  }, dispatch)
);
