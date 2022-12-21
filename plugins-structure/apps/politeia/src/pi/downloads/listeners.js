import { isAnyOf } from "@reduxjs/toolkit";

import { ticketvoteTimestamps } from "@politeiagui/ticketvote/timestamps";
import { commentsTimestamps } from "@politeiagui/comments/timestamps";
import { recordsTimestamps } from "@politeiagui/core/records/timestamps";
import { ticketvoteDetails } from "@politeiagui/ticketvote/details";
import { ticketvoteResults } from "@politeiagui/ticketvote/results";

function injectEffect(effect) {
  return async ({ meta }, { getState, dispatch }) => {
    const state = getState();
    await effect(state, dispatch, meta.total);
  };
}

function injectErrorEffect(effect) {
  return async ({ payload }, { getState, dispatch }) => {
    await effect(getState(), dispatch, {
      title: "Download failed",
      body: payload,
      kind: "error",
    });
  };
}

const initDownloadProgressListenerCreator = {
  matcher: isAnyOf(
    ticketvoteTimestamps.fetchAll.pending,
    commentsTimestamps.fetchAll.pending
  ),
  injectEffect,
};

const updateDownloadProgressListenerCreator = {
  matcher: isAnyOf(
    ticketvoteTimestamps.fetch.fulfilled,
    commentsTimestamps.fetch.fulfilled
  ),
  injectEffect,
};

const endDownloadProgressListenerCreator = {
  matcher: isAnyOf(
    ticketvoteTimestamps.fetchAll.fulfilled,
    ticketvoteTimestamps.fetchAll.rejected,
    commentsTimestamps.fetchAll.fulfilled,
    commentsTimestamps.fetchAll.rejected
  ),
  injectEffect,
};

const failedDownloadProgressListenerCreator = {
  matcher: isAnyOf(
    ticketvoteTimestamps.fetchAll.rejected,
    commentsTimestamps.fetchAll.rejected,
    recordsTimestamps.fetch.rejected,
    ticketvoteDetails.fetch.rejected,
    ticketvoteResults.fetch.rejected
  ),
  injectEffect: injectErrorEffect,
};

export const downloadServicesSetup = [
  {
    id: "global/progress/init",
    listenerCreator: initDownloadProgressListenerCreator,
  },
  {
    id: "global/progress/end",
    listenerCreator: endDownloadProgressListenerCreator,
  },
  {
    id: "global/progress/update",
    listenerCreator: updateDownloadProgressListenerCreator,
  },
  {
    id: "global/message/set",
    listenerCreator: failedDownloadProgressListenerCreator,
  },
];
