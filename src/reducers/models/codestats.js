import * as act from "src/actions/types";
import set from "lodash/fp/set";

const DEFAULT_STATE = {
  byUserID: {}
};

const codestats = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_CODE_STATS]: () => {
            const { userid, codestats } = action.payload;
            return set(["byUserID", userid], codestats)(state);
          },
          [act.RECEIVE_CMS_LOGOUT]: () => DEFAULT_STATE
        }[action.type] || (() => state)
      )();

export default codestats;
