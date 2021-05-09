import * as act from "src/actions/types";
import set from "lodash/fp/set";
import update from "lodash/fp/update";

const DEFAULT_STATE = {
  byUserID: {}
};

const credits = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_USER_PROPOSAL_CREDITS]: () =>
            set(["byUserID", action.payload.userid], {
              unspent: action.payload.unspentcredits,
              spent: action.payload.spentcredits,
              newcredits: null
            })(state),
          [act.RECEIVE_RESCAN_USER_PAYMENTS]: () => {
            const userid = action.payload.userid;
            const newcredits = action.payload.newcredits || [];
            const unspent = state.byUserID[userid]
              ? [...state.byUserID[userid].unspent, ...newcredits]
              : [...newcredits];
            return update(["byUserID", userid], (credits) => ({
              ...credits,
              unspent: unspent,
              newcredits: newcredits.length
            }))(state);
          },
          [act.RESET_RESCAN_USER_PAYMENTS]: () =>
            update(["byUserID", action.payload], (credits) => ({
              ...credits,
              newcredits: null
            }))(state)
        }[action.type] || (() => state)
      )();

export default credits;
