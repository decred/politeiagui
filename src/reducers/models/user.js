import * as act from "src/actions/types";
import set from "lodash/fp/set";
import compose from "lodash/fp/compose";

const DEFAULT_STATE = {
  proposalCredits: {
    purchases: {
      unspentcredits: null,
      spentcredits: null
    },
    credits: null
  }
};

const user = (state = DEFAULT_STATE, action) =>
  action.error
    ? () => state
    : ({
        [act.RECEIVE_USER_PROPOSAL_CREDITS]: () => {
          const { unspentcredits, spentcredits } = action.payload;
          return compose(
            set(
              ["proposalCredits", "purchases", "unspentcredits"],
              unspentcredits
            ),
            set(["proposalCredits", "purchases", "spentcredits"], spentcredits)
          )(state);
        },
        [act.RECEIVE_RESCAN_USER_PAYMENTS]: () => {
          const { newcredits } = action.payload;
          const credits = newcredits + state.proposalCredits.unspentcredits;
          return set(["proposalCredits", "unspentcredits"], credits)(state);
        },
        [act.SET_PROPOSAL_CREDITS]: () => {
          const credits = action.payload;
          return set(["proposalCredits", "credits"], credits)(state);
        }
      }[action.type] || (() => state))();

export default user;
