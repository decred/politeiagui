import { fetchProposalDetails } from "./actions";
import {
  downloadCommentsTimestampsEffect,
  downloadRecordTimestampsEffect,
  downloadTicketvoteTimestampsEffect,
} from "./effects";
import {
  getRfpRecordLink,
  isProposalCompleteOrClosed,
  isRfpProposal,
  proposalFilenames,
} from "../../pi/proposals/utils";

function injectEffect(effect) {
  return async ({ payload }, { getState, dispatch }) => {
    const state = getState();
    await effect(state, dispatch, { token: payload.censorshiprecord.token });
  };
}

function injectRecordDetailsEffect(effect) {
  return async (
    { payload },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    await effect(state, dispatch, {
      token: payload,
    });
    subscribe();
  };
}

function injectCompletedOrClosedProposalEffect(effect) {
  return async (
    { payload, meta },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    const [token] = meta.arg.tokens;
    const { status } = Object.values(payload.summaries)[0];

    if (isProposalCompleteOrClosed(status)) {
      await effect(state, dispatch, { token });
    }
    subscribe();
  };
}

function injectRfpProposalEffect(effect) {
  return async (
    { payload: record },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    if (isRfpProposal(record)) {
      await effect(state, dispatch, { token: record.censorshiprecord.token });
    }
    subscribe();
  };
}

function injectRfpSubmissionsEffect(effect) {
  return async ({ payload }, { getState, dispatch }) => {
    const state = getState();
    const { submissions } = payload;
    await effect(state, dispatch, {
      inventoryList: submissions,
      filenames: proposalFilenames,
    });
  };
}

function injectRfpLinkedProposalEffect(effect) {
  return async (
    { payload: record },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    const token = getRfpRecordLink(record);
    if (token) {
      await effect(state, dispatch, {
        inventoryList: [token],
        filenames: proposalFilenames,
      });
    }
    subscribe();
  };
}

function injectPayloadEffect(effect) {
  return async (
    { payload },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    await effect(state, dispatch, payload);
    subscribe();
  };
}

export const fetchDetailsListenerCreator = {
  type: "records/fetchDetails/fulfilled",
  injectEffect,
};

export const fetchProposalSummaryListenerCreator = {
  type: "piSummaries/fetch/fulfilled",
  injectEffect: injectCompletedOrClosedProposalEffect,
};

export const recordFetchDetailsListenerCreator = {
  actionCreator: fetchProposalDetails,
  injectEffect: injectRecordDetailsEffect,
};

export const fetchVoteSummaryListenerCreator = {
  type: "ticketvoteSummaries/fetch/fulfilled",
  injectEffect: injectPayloadEffect,
};

export const fetchBillingStatusChangesListenerCreator = {
  type: "piBilling/fetchStatusChanges/fulfilled",
  injectEffect: injectPayloadEffect,
};

export const fetchRecordDetailsListenerCreator = {
  type: "records/fetchDetails/fulfilled",
  injectEffect: injectPayloadEffect,
};

// RFP Proposal
export const fetchRfpDetailsListenerCreator = {
  type: "records/fetchDetails/fulfilled",
  injectEffect: injectRfpProposalEffect,
};

export const fetchRfpSubmissionsListenerCreator = {
  type: "ticketvoteSubmissions/fetch/fulfilled",
  injectEffect: injectRfpSubmissionsEffect,
};

// RFP Submission
export const fetchRfpLinkedProposalListenerCreator = {
  type: "records/fetchDetails/fulfilled",
  injectEffect: injectRfpLinkedProposalEffect,
};

// Listeners
export const listeners = [
  {
    type: "commentsTimestamps/fetchAll/fulfilled",
    effect: downloadCommentsTimestampsEffect,
  },
  {
    type: "records/fetchTimestamps/fulfilled",
    effect: downloadRecordTimestampsEffect,
  },
  {
    type: "ticketvoteTimestamps/fetchAll/fulfilled",
    effect: downloadTicketvoteTimestampsEffect,
  },
];
