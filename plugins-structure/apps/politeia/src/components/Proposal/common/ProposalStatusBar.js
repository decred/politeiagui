import React from "react";
import { TicketvoteRecordVoteStatusBar } from "@politeiagui/ticketvote/ui";

function ProposalStatusBar({ voteSummary }) {
  return <TicketvoteRecordVoteStatusBar ticketvoteSummary={voteSummary} />;
}

export default ProposalStatusBar;
