import { isAnyOf } from "@reduxjs/toolkit";

import { ticketvoteTimestamps } from "@politeiagui/ticketvote/timestamps";
import { commentsTimestamps } from "@politeiagui/comments/timestamps";
import { recordsTimestamps } from "@politeiagui/core/records/timestamps";
import { ticketvoteDetails } from "@politeiagui/ticketvote/details";
import { ticketvoteResults } from "@politeiagui/ticketvote/results";

import {
  messageSetups,
  progressSetups,
} from "@politeiagui/core/globalServices";

async function onUpdateProgress(effect, { meta }, { getState, dispatch }) {
  const state = getState();
  await effect(state, dispatch, meta.total);
}

async function onDownloadError(effect, { payload }, { getState, dispatch }) {
  await effect(getState(), dispatch, {
    title: "Download failed",
    body: payload,
  });
}

const isDownloadPending = isAnyOf(
  ticketvoteTimestamps.fetchAll.pending,
  commentsTimestamps.fetchAll.pending
);

const isDownloadBatchFinished = isAnyOf(
  ticketvoteTimestamps.fetch.fulfilled,
  commentsTimestamps.fetch.fulfilled
);

const isDownloadFinished = isAnyOf(
  ticketvoteTimestamps.fetchAll.fulfilled,
  ticketvoteTimestamps.fetchAll.rejected,
  commentsTimestamps.fetchAll.fulfilled,
  commentsTimestamps.fetchAll.rejected
);

const isDownloadFailed = isAnyOf(
  ticketvoteTimestamps.fetchAll.rejected,
  commentsTimestamps.fetchAll.rejected,
  recordsTimestamps.fetch.rejected,
  ticketvoteDetails.fetch.rejected,
  ticketvoteResults.fetch.rejected
);

export const downloadServicesSetups = [
  progressSetups.init
    .listenTo({ matcher: isDownloadPending })
    .customizeEffect(onUpdateProgress),
  progressSetups.end
    .listenTo({ matcher: isDownloadFinished })
    .customizeEffect(onUpdateProgress),
  progressSetups.update
    .listenTo({ matcher: isDownloadBatchFinished })
    .customizeEffect(onUpdateProgress),
  messageSetups.set
    .listenTo({ matcher: isDownloadFailed })
    .customizeEffect(onDownloadError),
];
