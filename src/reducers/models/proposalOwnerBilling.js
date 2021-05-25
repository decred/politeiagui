import * as act from "src/actions/types";
import { set } from "lodash/fp";
import { shortRecordToken } from "src/helpers";

const DEFAULT_STATE = {
  byProposalToken: {}
};

const proposalOwnerBilling = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_PROPOSAL_BILLING]: () => {
            const { token, response } = action.payload;
            return set(
              ["byProposalToken", shortRecordToken(token)],
              response
            )(state);
          },
          [act.RECEIVE_CMS_LOGOUT]: () => DEFAULT_STATE
        }[action.type] || (() => state)
      )();

export default proposalOwnerBilling;
