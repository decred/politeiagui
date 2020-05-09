import React from "react";
import { StatusBar, StatusTag, Text } from "pi-ui";
import VotesCount from "../Proposal/VotesCount";
import { Row } from "../layout";
import {
  getVotesReceived,
  getQuorumInVotes
} from "src/containers/Proposal/helpers";
import {
  getProposalStatusTagProps,
  getStatusBarData
} from "../Proposal/helpers";
import {
  isVoteActiveProposal,
  isPublicProposal,
  isAbandonedProposal,
  isVotingFinishedProposal
} from "src/containers/Proposal/helpers";
import styles from "./ProposalsList.module.css";
import { Status, Event } from "../RecordWrapper";
import { useProposalVoteTimeInfo } from "src/containers/Proposal/hooks";

const ProposalItem = ({ proposal, voteSummary }) => {
  const isVoteActive = isVoteActiveProposal(voteSummary);
  const hasvoteSummary = !!voteSummary && !!voteSummary.endheight;
  const isAbandoned = isAbandonedProposal(proposal);
  const isPublic = isPublicProposal(proposal);
  const isVotingFinished = isVotingFinishedProposal(voteSummary);
  const { voteEndTimestamp, voteBlocksLeft } = useProposalVoteTimeInfo(
    voteSummary
  );
  return (
    proposal &&
    voteSummary && (
      <Row
        className={styles.itemWrapper}
        justify="space-between"
        align="center">
        <div className={styles.itemTitle}>{proposal.name}</div>
        {hasvoteSummary && (
          <Row className={styles.statusBarWrapper} noMargin>
            <StatusBar
              max={getQuorumInVotes(voteSummary)}
              status={getStatusBarData(voteSummary)}
              markerPosition={`${voteSummary.passpercentage}%`}
              markerTooltipText={`${voteSummary.passpercentage}% Yes votes required for approval`}
              markerTooltipClassName={styles.statusBarTooltip}
              renderStatusInfoComponent={
                <VotesCount
                  isVoteActive={isVoteActive}
                  quorumVotes={getQuorumInVotes(voteSummary)}
                  votesReceived={getVotesReceived(voteSummary)}
                />
              }
            />
          </Row>
        )}
        {(isVoteActive || isVotingFinished) && (
          <Event
            event={`vote end${isVoteActive ? "s" : "ed"}`}
            timestamp={voteEndTimestamp}
            className={styles.timeLeft}
            size="small"
          />
        )}
        {isVoteActive && (
          <>
            <Text className={styles.blocksLeft} size="small">
              {`${voteBlocksLeft} blocks left`}
            </Text>
          </>
        )}
        {(isPublic || isAbandoned) && (
          <Status className={styles.status}>
            <StatusTag
              className={styles.statusTag}
              {...getProposalStatusTagProps(proposal, voteSummary)}
            />
          </Status>
        )}
      </Row>
    )
  );
};

// TODO: add props types
export default ProposalItem;
