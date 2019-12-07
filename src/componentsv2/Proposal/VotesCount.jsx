import React from "react";
import PropTypes from "prop-types";
import { Text, useMediaQuery, Tooltip, useTheme } from "pi-ui";
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
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";

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
          <Tooltip className={styles.quorumTooltip} content={`${votesReceived} votes cast, quorum requirement is ${quorumVotes} votes`}>
            <Text className={styles.votesReceived} size="small">{votesReceived}</Text>
            <Text color={ isDarkTheme ? "secondaryDark" : "gray" } size="small">/{`${quorumVotes} votes`}</Text>
          </Tooltip>
        </>
      ) : isVoteActive ? (
        <Text color={ isDarkTheme ? "secondaryDark" : "gray" } size="small">
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
