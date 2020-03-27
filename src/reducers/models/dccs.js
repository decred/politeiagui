import * as act from "src/actions/types";
import set from "lodash/fp/set";
import update from "lodash/fp/update";
import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import union from "lodash/fp/union";
import concat from "lodash/fp/concat";
import isEmpty from "lodash/isEmpty";

const DEFAULT_STATE = {
  byToken: {},
  all: [],
  byStatus: {}
};

const dccToken = (dcc) => dcc.censorshiprecord.token;
const dccStatus = (dcc) => dcc.status;

const dccArrayToByTokenObject = (dccs) =>
  dccs.reduce(
    (dccsByToken, dcc) => ({
      ...dccsByToken,
      [dccToken(dcc)]: dcc
    }),
    {}
  );

const dccArrayToByStatusObject = (dccs) =>
  dccs.reduce(
    (dccsByStatus, dcc) => ({
      ...dccsByStatus,
      [dccStatus(dcc)]: {
        ...(dccsByStatus[dccStatus(dcc)] || []),
        [dccToken(dcc)]: dcc
      }
    }),
    {}
  );

const dccByStatusRemoveByToken = (dccs, token) =>
  !isEmpty(dccs)
    ? dccs.reduce(
        (dccsByStatus, dcc) =>
          dcc.censorshiprecord.token === token
            ? dccsByStatus
            : [...dccsByStatus, dcc],
        []
      )
    : dccs;

const dccByStatusAddDcc = (
  dccs = [],
  newDcc,
  status,
  statuschangereason,
  timereviewed
) =>
  concat({
    ...newDcc,
    status,
    statuschangereason,
    timereviewed
  })(dccs);

const onReceiveDccs = (state, receivedDccs) =>
  compose(
    update("byToken", (dccs) => ({
      ...dccs,
      ...dccArrayToByTokenObject(receivedDccs)
    })),
    update("all", union(receivedDccs.map(dccToken))),
    update("byStatus", (dccs) => ({
      ...dccs,
      ...dccArrayToByStatusObject(receivedDccs)
    }))
  )(state);

const onReceiveDcc = (state, receivedDcc) =>
  set(["byToken", dccToken(receivedDcc)], {
    ...receivedDcc
  })(state);

const onReceiveSupportOpposeDcc = (state, payload) => {
  const { token, userid, username, isSupport } = payload;

  const support = compose(
    update(["byToken", token, "supportuserids"], (supportids) => [
      ...supportids,
      userid
    ]),
    update(["byToken", token, "supportusernames"], (supportusernames) => [
      ...supportusernames,
      username
    ])
  );

  const oppose = compose(
    update(["byToken", token, "againstuserids"], (againstids) => [
      ...againstids,
      userid
    ]),
    update(["byToken", token, "againstusernames"], (againstusernames) => [
      ...againstusernames,
      username
    ])
  );
  return isSupport ? support(state) : oppose(state);
};

const onReceiveSetDccStatus = (state, payload) => {
  const { status: newStatus, reason, token } = payload;
  const { status: oldStatus, ...dcc } = get(["byToken", token])(state);
  const timereviewed = Date.now() / 1000;

  return compose(
    set(["byToken", token], {
      ...dcc,
      status: newStatus,
      statuschangereason: reason,
      timereviewed
    }),
    update(["byStatus", oldStatus], (dccsByOldDccStatus) =>
      dccByStatusRemoveByToken(dccsByOldDccStatus, token)
    ),
    update(["byStatus", newStatus], (dccsByNewDccStatus) =>
      dccByStatusAddDcc(
        dccsByNewDccStatus,
        dcc,
        newStatus,
        reason,
        timereviewed
      )
    )
  )(state);
};
const onReceiveDraftDcc = (state, draft) =>
  set(["drafts", draft.id], {
    ...draft
  })(state);

const onReceiveDrafts = (state, drafts) =>
  set("drafts", {
    ...drafts
  })(state);

const dccs = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_DCCS]: () => onReceiveDccs(state, action.payload.dccs),
          [act.RECEIVE_DCC]: () => onReceiveDcc(state, action.payload.dcc),
          [act.RECEIVE_SUPPORT_OPPOSE_DCC]: () =>
            onReceiveSupportOpposeDcc(state, action.payload),
          [act.RECEIVE_SET_DCC_STATUS]: () =>
            onReceiveSetDccStatus(state, action.payload),
          [act.SAVE_DRAFT_DCC]: () => onReceiveDraftDcc(state, action.payload),
          [act.LOAD_DRAFT_DCCS]: () => onReceiveDrafts(state, action.payload)
        }[action.type] || (() => state)
      )();

export default dccs;
