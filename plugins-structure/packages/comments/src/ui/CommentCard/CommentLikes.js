import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Icon, Text, classNames } from "pi-ui";
import debounce from "lodash/debounce";
import styles from "./styles.module.css";

export const CommentLikes = ({
  upvotes,
  downvotes,
  hide,
  disabled,
  voteIconColor,
  onVote,
}) => {
  // Avoid multi-clicking actions
  async function handleLike() {
    await onVote(1);
  }

  async function handleDislike() {
    await onVote(-1);
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
        className={classNames(styles.likesResult, "unselectable")}
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
              disabled && styles.likeDisabled
            )}
            data-testid="like-btn"
            onClick={handleDebounceVote(handleLike)}
          >
            <Icon
              iconColor={voteIconColor}
              backgroundColor={voteIconColor}
              type="like"
            />
          </button>
          {renderCount(upvotes, true)}
        </div>
        <div className={styles.rightLikeBox}>
          <button
            className={classNames(
              styles.likeBtn,
              disabled && styles.likeDisabled
            )}
            data-testid="dislike-btn"
            onClick={handleDebounceVote(handleDislike)}
          >
            <Icon
              iconColor={voteIconColor}
              backgroundColor={voteIconColor}
              type="dislike"
            />
          </button>
          {renderCount(downvotes)}
        </div>
      </div>
    )
  );
};

CommentLikes.propTypes = {
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired,
  hide: PropTypes.bool,
  disabled: PropTypes.bool,
  voteIconColor: PropTypes.string,
  onVote: PropTypes.func,
};

CommentLikes.defaultProps = {
  upvotes: 0,
  downvotes: 0,
  onVote: () => {},
};
