import React from "react";
import PropTypes from "prop-types";
import { Text, Icon, Tooltip } from "pi-ui";
import styles from "./styles.module.css";

export const TicketvoteRecordVotesCount = ({
  quorumVotes,
  votesReceived,
  onSearchVotes,
  isVoteActive,
  searchIconColor,
  tooltipClassName,
}) => {
  const votesLeft = quorumVotes - votesReceived;
  const displaySearchIcon = onSearchVotes && votesReceived > 0;
  return (
    <div>
      <div className={styles.mobileOnly}>
        {displaySearchIcon && (
          <Icon
            type="search"
            iconColor={searchIconColor}
            onClick={onSearchVotes}
            className={styles.voteCountSearch}
          />
        )}
        <Tooltip
          className={
            !tooltipClassName
              ? styles.votesCountQuorumTooltip
              : tooltipClassName
          }
          content={`${votesReceived} votes cast, quorum requirement is ${quorumVotes} votes`}
          placement="left"
        >
          <Text size="small">{votesReceived}</Text>
          <Text size="small">/{`${quorumVotes} votes`}</Text>
        </Tooltip>
      </div>
      {isVoteActive && (
        <Text className={styles.votesCountLeft} size="small">
          {votesLeft > 0 ? `${votesLeft} votes left` : "quorum reached"}
        </Text>
      )}
    </div>
  );
};

TicketvoteRecordVotesCount.propTypes = {
  quorumVotes: PropTypes.number,
  votesReceived: PropTypes.number,
  onSearchVotes: PropTypes.func,
  isVoteActive: PropTypes.bool,
  searchIconColor: PropTypes.string,
  tooltipClassName: PropTypes.string,
};

TicketvoteRecordVotesCount.defaultProps = {
  isVoteActive: false,
  votesReceived: 0,
};
