import React from "react";
import PropTypes from "prop-types";
import { Text, useMediaQuery } from "pi-ui";
import iconSearchSmall from "src/assets/search-small.svg";
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
          <Text size="small">{votesReceived}/</Text>
          <Text color="gray" size="small">{`${quorumVotes} votes`}</Text>
        </>
      ) : isVoteActive ? (
        <Text color="gray" size="small">
          {votesLeft > 0 ? votesLeft : ""}
          {` votes left`}
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
