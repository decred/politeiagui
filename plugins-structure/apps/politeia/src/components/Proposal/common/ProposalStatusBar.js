import React from "react";
import { TicketvoteRecordVoteStatusBar } from "@politeiagui/ticketvote/ui";
import { showVoteStatusBar } from "../../../pi/proposals/utils";

function ProposalStatusBar({ voteSummary }) {
  return (
    showVoteStatusBar(voteSummary) && (
      <TicketvoteRecordVoteStatusBar ticketvoteSummary={voteSummary} />
    )
  );
}

export default ProposalStatusBar;
