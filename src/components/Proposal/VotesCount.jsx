import React from "react";
import PropTypes from "prop-types";
import { Text, classNames, Tooltip } from "pi-ui";
import styles from "./Proposal.module.css";

const VotesCount = ({
  eligibleVotes,
  quorumVotes,
  quorumPercentage,
  votesReceived
}) => {
  const votesLeft = quorumVotes - votesReceived;
  return (
    <div className={styles.voteCount}>
      <div className={styles.quorumAndVotes}>
        <div>
          <Text
            className={classNames(styles.votesLeft, styles.quorumReached)}
            size="small"
          >
            {votesLeft > 0 ? (
              `${votesLeft} votes until quorum`
            ) : (
              <Tooltip
                placement="bottom"
                content={`quorum of ${quorumPercentage}% (${quorumVotes} votes) has been reached!`}
              >
                quorum reached!
              </Tooltip>
            )}
          </Text>
        </div>
        <div>
          <Text className={styles.votesReceived} size="small">
            {votesReceived}
          </Text>
          <Text className={styles.votesQuorum} size="small">
            /{`${eligibleVotes} votes`}
          </Text>
        </div>
      </div>
    </div>
  );
};

VotesCount.propTypes = {
  quorumVotes: PropTypes.number,
  votesReceived: PropTypes.number,
  onSearchVotes: PropTypes.func
};

export default VotesCount;
