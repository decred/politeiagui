import React from "react";
import { StatusBar } from "pi-ui";
import { ticketvoteHelpers } from "../../ticketvote";
import { TicketvoteRecordVotesCount } from "./VotesCount";

import styles from "./styles.module.css";

export const TicketvoteRecordVoteStatusBar = ({ ticketvoteSummary }) => {
  if (!ticketvoteSummary) return "No summaries";
  const quorum = ticketvoteHelpers.getQuorumInVotes(ticketvoteSummary);
  const statusBarData = ticketvoteHelpers.getStatusBarData(ticketvoteSummary);
  const votesReceived = ticketvoteHelpers.getVotesReceived(ticketvoteSummary);
  const { passpercentage } = ticketvoteSummary;
  return (
    <div data-testid="ticketvote-vote-status-bar">
      <StatusBar
        max={quorum}
        status={statusBarData}
        markerPosition={`${passpercentage}%`}
        markerTooltipText={`${passpercentage}% Yes votes required for approval`}
        markerTooltipClassName={styles.statusBarTooltip}
        renderStatusInfoComponent={
          <TicketvoteRecordVotesCount
            isVoteActive={true}
            quorumVotes={quorum}
            votesReceived={votesReceived}
            onSearchVotes={() => {
              console.log("SEARCHING");
            }}
          />
        }
      />
    </div>
  );
};
