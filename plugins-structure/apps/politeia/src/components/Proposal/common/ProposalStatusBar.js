import React from "react";
import { TicketvoteRecordVoteStatusBar } from "@politeiagui/ticketvote/ui";
import { showVoteStatusBar } from "../utils";

function ProposalStatusBar({ voteSummary }) {
  return (
    showVoteStatusBar(voteSummary) && (
      <TicketvoteRecordVoteStatusBar ticketvoteSummary={voteSummary} />
    )
  );
}

export default ProposalStatusBar;
