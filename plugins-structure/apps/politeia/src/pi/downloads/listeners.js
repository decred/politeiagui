import { isAnyOf } from "@reduxjs/toolkit";

import { ticketvoteTimestamps } from "@politeiagui/ticketvote/timestamps";
import { commentsTimestamps } from "@politeiagui/comments/timestamps";

function injectEffect(effect) {
  return async ({ meta }, { getState, dispatch }) => {
    const state = getState();
    await effect(state, dispatch, meta.total);
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
];
