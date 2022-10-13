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
    commentsTimestamps.fetchAll.fulfilled
  ),
  injectEffect,
};

export const downloadServicesSetup = [
  {
    id: "ui/progress/init",
    listenerCreator: initDownloadProgressListenerCreator,
  },
  {
    id: "ui/progress/end",
    listenerCreator: endDownloadProgressListenerCreator,
  },
  {
    id: "ui/progress/update",
    listenerCreator: updateDownloadProgressListenerCreator,
  },
];
