import React from "react";
import PropTypes from "prop-types";
import { Text, useMediaQuery, Tooltip, useTheme, classNames } from "pi-ui";
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
          <Tooltip
            className={classNames(
              styles.quorumTooltip,
              isDarkTheme && styles.darkQuorumTooltip
            )}
            content={`${votesReceived} votes cast, quorum requirement is ${quorumVotes} votes`}
            placement="left">
            <Text className={styles.votesReceived} size="small">
              {votesReceived}
            </Text>
            <Text className={styles.votesQuorum} size="small">
              /{`${quorumVotes} votes`}
            </Text>
          </Tooltip>
        </>
      ) : isVoteActive ? (
        <Text
          className={classNames(styles.votesLeft, styles.quorumReached)}
          size="small">
          {votesLeft > 0 ? `${votesLeft} votes left` : "quorum reached"}
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
