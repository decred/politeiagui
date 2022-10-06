import React from "react";
import PropTypes from "prop-types";
import { Text, Tooltip } from "pi-ui";
import styles from "./styles.module.css";

export const TicketvoteRecordVotesCount = ({
  quorumVotes,
  votesReceived,
  isVoteActive,
  tooltipClassName,
}) => {
  const votesLeft = quorumVotes - votesReceived;
  return (
    <div>
      <div className={styles.mobileOnly}>
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
  isVoteActive: PropTypes.bool,
  tooltipClassName: PropTypes.string,
};

TicketvoteRecordVotesCount.defaultProps = {
  isVoteActive: false,
  votesReceived: 0,
};
