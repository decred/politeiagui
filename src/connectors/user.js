import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";
import {
  EDIT_USER_CLEAR_USER_PAYWALL,
  EDIT_USER_EXPIRE_NEW_USER_VERIFICATION,
  EDIT_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  EDIT_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
  EDIT_USER_UNLOCK
} from "../constants";

export default connect(
  sel.selectorMap({
    userId: compose(
      get([ "match", "params", "userId" ]),
      arg(1)
    ),
    user: sel.user,
    error: sel.apiUserError,
    isLoading: sel.isApiRequestingUser,
    isTestnet: sel.isTestNet,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
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
    editUserResponse: sel.editUserResponse
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchUser,
    onEditUser: act.onEditUser
  }, dispatch)
);
