import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const invite = connect(
  sel.selectorMap({
    inviteUserResponse: sel.inviteUserResponse,
    isRequesting: sel.isApiRequestingInviteUser,
    policy: sel.policy
  }),
  {
    onInviteUserConfirm: act.onInviteUserConfirm,
    resetInviteUser: act.onResetInviteUser,
    onFetchData: act.onGetPolicy
  }
);

export default invite;
