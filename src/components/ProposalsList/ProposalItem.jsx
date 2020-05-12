import React from "react";
import PropTypes from "prop-types";
import { StatusBar, StatusTag, Text, classNames, Icon } from "pi-ui";
import VotesCount from "../Proposal/VotesCount";
import { Row } from "../layout";
import {
  getVotesReceived,
  getQuorumInVotes,
  goToFullProposal
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
import { Status, Event, CommentsLink } from "../RecordWrapper";
import { useProposalVoteTimeInfo } from "src/containers/Proposal/hooks";
import { useProposalURLs } from "src/containers/Proposal/hooks";
import { useRouter } from "src/components/Router";

const ProposalItem = ({
  proposal,
  proposal: { numcomments, name, censorshiprecord },
  voteSummary
}) => {
  const { history } = useRouter();
  const isVoteActive = isVoteActiveProposal(voteSummary);
  const hasvoteSummary = !!voteSummary && !!voteSummary.endheight;
  const isAbandoned = isAbandonedProposal(proposal);
  const isPublic = isPublicProposal(proposal);
  const isVotingFinished = isVotingFinishedProposal(voteSummary);
  const proposalToken = censorshiprecord && censorshiprecord.token;
  const { commentsURL, proposalURL } = useProposalURLs(
    proposalToken,
    null,
    null,
    null
  );
  const { voteEndTimestamp } = useProposalVoteTimeInfo(voteSummary);

  return (
    proposal &&
    voteSummary && (
      <Row
        className={styles.itemWrapper}
        justify="space-between"
        align="center"
        onClick={goToFullProposal(history, proposalURL)}
        noMargin>
        <div className={classNames(styles.itemTitle, "flex-column")}>
          <Text color="primaryDark">{name}</Text>
          <CommentsLink
            showIcon={false}
            numOfComments={numcomments}
            url={commentsURL}
            className={styles.commentsLink}
          />
        </div>
        {hasvoteSummary && (
          <Row
            className={styles.statusBarWrapper}
            justify="center"
            align="center"
            noMargin>
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
          <Row
            className={styles.timeLeftPassed}
            justify="center"
            align="center"
            noMargin>
            <Event
              event={`vote end${isVoteActive ? "s" : "ed"}`}
              timestamp={voteEndTimestamp}
              className={styles.voteEvent}
              size="small"
            />
          </Row>
        )}
        {(isPublic || isAbandoned) && (
          <Row
            className={styles.statusWrapper}
            justify="center"
            align="center"
            noMargin>
            <Status className={styles.status}>
              <StatusTag
                className={styles.statusTag}
                {...getProposalStatusTagProps(proposal, voteSummary)}
              />
            </Status>
            <div className="margin-left-s">
              <Icon
                type="clickArrow"
                viewBox="0 0 5 10"
                width={5}
                height={10}
              />
            </div>
          </Row>
        )}
      </Row>
    )
  );
};

ProposalItem.propTypes = {
  proposal: PropTypes.object.isRequired,
  voteSummary: PropTypes.object.isRequired
};

export default ProposalItem;
