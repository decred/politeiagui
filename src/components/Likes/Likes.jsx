import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { Icon, useTheme, Text, getThemeProperty, classNames } from "pi-ui";
import styles from "./Likes.module.css";

export const isLiked = (action) => action === 1 || action === "1";
export const isDisliked = (action) => action === -1 || action === "-1";

const Likes = ({ upLikes, downLikes, onLike, onDislike, option, disabled }) => {
  const { theme } = useTheme();
  const defaultColor = getThemeProperty(theme, "comment-like-color");
  const activeColor = getThemeProperty(theme, "comment-like-color-active");
  const liked = isLiked(option);
  const disliked = isDisliked(option);
  const likeColor = liked ? activeColor : defaultColor;
  const dislikeColor = disliked ? activeColor : defaultColor;

  async function handleLike() {
    if (disabled) return;
    await onLike();
  }

  async function handleDislike() {
    if (disabled) return;
    await onDislike();
  }

  const debouncedHandleDislike = debounce(handleDislike, 500);
  const debouncedHandleLike = debounce(handleLike, 500);

  const renderCount = useCallback(
    (count) => (
      <Text
        data-testid="score"
        size="small"
        className={classNames(styles.likesResult, "unselectable")}>
        {count}
      </Text>
    ),
    []
  );

  return (
    <div className={"align-center"}>
      <div className={styles.leftLikeBox}>
        <button
          className={classNames(
            styles.likeBtn,
            disabled && styles.likeDisabled
          )}
          data-testid="like-btn"
          onClick={debouncedHandleLike}>
          <Icon iconColor={likeColor} backgroundColor={likeColor} type="like" />
        </button>
        {renderCount(upLikes)}
      </div>
      <div className={styles.rightLikeBox}>
        <button
          className={classNames(
            styles.likeBtn,
            disabled && styles.likeDisabled
          )}
          data-testid="dislike-btn"
          onClick={debouncedHandleDislike}>
          <Icon
            iconColor={dislikeColor}
            backgroundColor={dislikeColor}
            type="dislike"
          />
        </button>
        {renderCount(downLikes)}
      </div>
    </div>
  );
};

Likes.propTypes = {
  upLikes: PropTypes.number,
  downLikes: PropTypes.number,
  option: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onLike: PropTypes.func,
  onDislike: PropTypes.func
};

Likes.defaultProps = {
  active: false,
  upLikes: 0,
  downLikes: 0
};

export default Likes;
