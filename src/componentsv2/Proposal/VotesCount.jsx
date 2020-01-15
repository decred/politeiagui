import React from "react";
import PropTypes from "prop-types";
import { Text, useMediaQuery, Tooltip } from "pi-ui";
import iconSearchSmall from "src/assets/images/search-small.svg";
import styles from "./Proposal.module.css";

const VotesCount = ({
  quorumVotes,
  votesReceived,
  onSearchVotes,
  isVoteActive
}) => {
  const isMobileScreen = useMediaQuery("(max-width:560px)");
  const votesLeft = quorumVotes - votesReceived;

  return (
    <div className={styles.voteCount}>
      {!isMobileScreen ? (
        <>
          {onSearchVotes && votesReceived > 0 && (
            <img
              onClick={onSearchVotes}
              alt="Search votes"
              className={styles.voteCountSearch}
              src={iconSearchSmall}
            />
          )}
          <Tooltip
            className={styles.quorumTooltip}
            content={`${votesReceived} votes cast, quorum requirement is ${quorumVotes} votes`}>
            <Text className={styles.votesReceived} size="small">
              {votesReceived}
            </Text>
            <Text className={styles.votesQuorum} size="small">
              /{`${quorumVotes} votes`}
            </Text>
          </Tooltip>
        </>
      ) : isVoteActive ? (
        <Text className={styles.votesLeft} size="small">
          {votesLeft > 0 ? votesLeft : ""}
          {" votes left"}
        </Text>
      ) : null}
    </div>
  );
};

VotesCount.propTypes = {
  quorumVotes: PropTypes.number,
  votesReceived: PropTypes.number,
  onSearchVotes: PropTypes.func
};

export default VotesCount;
