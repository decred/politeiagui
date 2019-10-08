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
        [act.RECEIVE_USER_PROPOSAL_CREDITS]: () => {
          const {
            userid,
            unspentcredits: unspent,
            spentcredits: spent
          } = action.payload;
          return set(["byUserID", userid], { unspent, spent })(state);
        },
        [act.RECEIVE_RESCAN_USER_PAYMENTS]: () => {
          const { userid, newcredits } = action.payload;
          return update(["byUserID", userid, "unspent"], (unspent = []) => [
            ...unspent,
            ...newcredits
          ])(state);
        }
      }[action.type] || (() => state))();

export default credits;
