import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { piBilling } from "../billing";
import { serviceSetups as proposalsSetups } from "./services";

import { isAnyOf } from "@reduxjs/toolkit";

// Proposals Listeners
export const voteStatusChangesListener =
  proposalsSetups.voteStatusChanges.listenTo({
    actionCreator: ticketvoteSummaries.fetch.fulfilled,
  });

export const recordsStatusChangesListener =
  proposalsSetups.recordStatusChanges.listenTo({
    matcher: isAnyOf(records.fetch.fulfilled, records.fetchDetails.fulfilled),
  });

export const billingStatusChangesListener =
  proposalsSetups.billingStatusChanges.listenTo({
    actionCreator: piBilling.fetch.fulfilled,
  });
