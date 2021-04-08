import React from "react";
import PropTypes from "prop-types";
import {
  StatusBar,
  StatusTag,
  classNames,
  Icon,
  useMediaQuery,
  useTheme,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
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
import Link from "../Link";
import { useProposalVoteTimeInfo } from "src/containers/Proposal/hooks";
import { useProposalURLs } from "src/containers/Proposal/hooks";
import { useRouter } from "src/components/Router";

const ProposalItem = ({
  proposal,
  proposal: { commentsCount, name, censorshiprecord },
  voteSummary
}) => {
  const { history } = useRouter();
  const isVoteActive = isVoteActiveProposal(voteSummary);
  const hasvoteSummary = !!voteSummary && !!voteSummary.endblockheight;
  const isAbandoned = isAbandonedProposal(proposal);
  const isPublic = isPublicProposal(proposal);
  const isVotingFinished = isVotingFinishedProposal(voteSummary);
  const proposalToken = censorshiprecord && censorshiprecord.token;
  const { commentsURL, proposalURL } = useProposalURLs(
    proposalToken,
    proposal.userid,
    !!proposal.linkto,
    proposal.linkto,
    proposal.state
  );

  const { voteEndTimestamp } = useProposalVoteTimeInfo(voteSummary);

  const mobile = useMediaQuery("(max-width: 760px)");
  const extraSmallMobile = useMediaQuery("(max-width: 560px)");
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;

  return (
    proposal &&
    voteSummary && (
      <Row
        className={styles.itemWrapper}
        justify="space-between"
        align={extraSmallMobile ? "flex-start" : "center"}
        onClick={goToFullProposal(history, proposalURL)}
        noMargin>
        <div className={classNames(styles.itemTitle, "flex-column")}>
          <Link dark to={proposalURL}>
            {name}
          </Link>
          <CommentsLink
            showIcon={false}
            numOfComments={commentsCount}
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
        {(isVoteActive || isVotingFinished) && !mobile && (
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
                {...getProposalStatusTagProps(
                  proposal,
                  voteSummary,
                  isDarkTheme
                )}
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
