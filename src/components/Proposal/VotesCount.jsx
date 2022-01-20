import React from "react";
import PropTypes from "prop-types";
import {
  Text,
  Icon,
  useTheme,
  classNames,
  getThemeProperty,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
import styles from "./Proposal.module.css";

const VotesCount = ({
  eligibleVotes,
  quorumVotes,
  votesReceived,
  onSearchVotes,
  isVoteActive
}) => {
  const votesLeft = quorumVotes - votesReceived;
  const { theme, themeName } = useTheme();
  const color = getThemeProperty(theme, "icon-color");
  const darkColor = getThemeProperty(theme, "color-dark");
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;

  return (
    <div className={styles.voteCount}>
      {isVoteActive && (
        <>
          {onSearchVotes && votesReceived > 0 && (
            <div>
              <Icon
                type="search"
                iconColor={isDarkTheme ? darkColor : color}
                onClick={onSearchVotes}
                className={styles.voteCountSearch}
              />
            </div>
          )}
          <div className={styles.quorumAndVotes}>
            <div>
              <Text
                className={classNames(styles.votesLeft, styles.quorumReached)}
                size="small">
                {votesLeft > 0
                  ? `${votesLeft} votes until quorum`
                  : "quorum reached!"}
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
        </>
      )}
    </div>
  );
};

VotesCount.propTypes = {
  quorumVotes: PropTypes.number,
  votesReceived: PropTypes.number,
  onSearchVotes: PropTypes.func
};

export default VotesCount;
