import * as act from "src/actions/types";
import set from "lodash/fp/set";
import update from "lodash/fp/update";

const DEFAULT_STATE = {
  byUserID: {}
};

const credits = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : ({
        [act.RECEIVE_USER_PROPOSAL_CREDITS]: () =>
          set(["byUserID", action.payload.userid], {
            unspent: action.payload.unspentcredits,
            spent: action.payload.spentcredits
          })(state),
        [act.RECEIVE_RESCAN_USER_PAYMENTS]: () =>
          update(
            ["byUserID", action.payload.userid, "unspent"],
            (unspent = []) => [...unspent, ...action.payload.newcredits]
          )(state)
      }[action.type] || (() => state))();

export default credits;
