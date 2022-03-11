import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Icon, Text, classNames } from "pi-ui";
import debounce from "lodash/debounce";
import styles from "./styles.module.css";

const UPVOTE = 1;
const DOWNVOTE = -1;

export const CommentVotes = ({
  upvotes,
  downvotes,
  hide,
  disabled,
  onVote,
  userVote,
}) => {
  const userUpvote = userVote === UPVOTE;
  const userDownvote = userVote === DOWNVOTE;

  // Avoid multi-clicking actions
  async function handleLike() {
    await onVote(UPVOTE);
  }

  async function handleDislike() {
    await onVote(DOWNVOTE);
  }
  const handleDebounceVote = (voteFn) =>
    debounce(() => {
      if (disabled) return;
      voteFn();
    }, 300);

  const renderCount = useCallback(
    (count, isLike) => (
      <Text
        data-testid={`score-${isLike ? "like" : "dislike"}`}
        size="small"
        className={styles.likesResult}
      >
        {count}
      </Text>
    ),
    []
  );
  return (
    !hide && (
      <div className={styles.votes}>
        <div className={styles.leftLikeBox}>
          <button
            className={classNames(
              styles.likeBtn,
              disabled && styles.likeDisabled,
              userUpvote && styles.hasVoted
            )}
            data-testid="like-btn"
            onClick={handleDebounceVote(handleLike)}
          >
            <Icon type="like" />
          </button>
          {renderCount(upvotes, true)}
        </div>
        <div className={styles.rightLikeBox}>
          <button
            className={classNames(
              styles.likeBtn,
              disabled && styles.likeDisabled,
              userDownvote && styles.hasVoted
            )}
            data-testid="dislike-btn"
            onClick={handleDebounceVote(handleDislike)}
          >
            <Icon type="dislike" />
          </button>
          {renderCount(downvotes)}
        </div>
      </div>
    )
  );
};

CommentVotes.propTypes = {
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired,
  hide: PropTypes.bool,
  disabled: PropTypes.bool,
  onVote: PropTypes.func,
};

CommentVotes.defaultProps = {
  upvotes: 0,
  downvotes: 0,
  onVote: () => {},
};
