import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { piBilling } from "../billing";
import { serviceListeners as proposalsListeners } from "./services";

import { isAnyOf } from "@reduxjs/toolkit";

// Proposals Listeners
export const voteStatusChangesListener =
  proposalsListeners.voteStatusChanges.listenTo({
    actionCreator: ticketvoteSummaries.fetch.fulfilled,
  });

export const recordsStatusChangesListener =
  proposalsListeners.recordStatusChanges.listenTo({
    matcher: isAnyOf(records.fetch.fulfilled, records.fetchDetails.fulfilled),
  });

export const billingStatusChangesListener =
  proposalsListeners.billingStatusChanges.listenTo({
    actionCreator: piBilling.fetch.fulfilled,
  });
