import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Icon,
  useTheme,
  Text,
  getThemeProperty,
  useHover,
  classNames
} from "pi-ui";
import styles from "./Likes.module.css";

export const isLiked = action => action === 1 || action === "1";
export const isDisliked = action => action === -1 || action === "-1";

const Likes = ({
  upLikes,
  downLikes,
  onLike,
  onDislike,
  option,
  disabled,
  asyncLoading
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [likeRef, isLikeHovered] = useHover();
  const [dislikeRef, isDislikeHovered] = useHover();
  const defaultColor = getThemeProperty(theme, "color-gray");
  const activeColor = getThemeProperty(theme, "color-primary-dark");
  const liked = isLiked(option);
  const disliked = isDisliked(option);
  const isDisabled = disabled || loading;
  const likeColor =
    (liked || isLikeHovered) && !isDisabled ? activeColor : defaultColor;
  const dislikeColor =
    (disliked || isDislikeHovered) && !isDisabled ? activeColor : defaultColor;

  async function handleLike() {
    if (disabled || loading) return;
    try {
      setLoading(true);
      await onLike();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  async function handleDislike() {
    if (disabled || loading) return;
    try {
      setLoading(true);
      await onDislike();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  const renderCount = useCallback(
    count => (
      <Text
        size="small"
        className={classNames(styles.likesResult, "unselectable")}
      >
        {count}
      </Text>
    ),
    []
  );

  return (
    <div className="align-center">
      <div className={styles.leftLikeBox}>
        <button
          disabled={loading || disabled}
          ref={likeRef}
          className={styles.likeBtn}
          onClick={asyncLoading ? handleLike : onLike}
        >
          <Icon
            onClick={onLike}
            iconColor={likeColor}
            backgroundColor={likeColor}
            type="like"
          />
        </button>
        {renderCount(upLikes)}
      </div>
      <div className={styles.rightLikeBox}>
        <button
          disabled={loading || disabled}
          ref={dislikeRef}
          className={styles.likeBtn}
          onClick={asyncLoading ? handleDislike : onDislike}
        >
          <Icon
            onClick={onDislike}
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
  asyncLoading: true,
  upLikes: 0,
  downLikes: 0
};

export default Likes;
