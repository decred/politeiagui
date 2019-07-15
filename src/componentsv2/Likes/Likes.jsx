import React, { useState } from "react";
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
  likes,
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

  return (
    <div className="align-center">
      <button
        disabled={loading || disabled}
        ref={likeRef}
        className={classNames(styles.likeBtn, "margin-right-s")}
        onClick={asyncLoading ? handleLike : onLike}
      >
        <Icon
          onClick={onLike}
          iconColor={likeColor}
          backgroundColor={likeColor}
          type="like"
        />
      </button>
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
      <Text size="small" className={styles.likesResult}>
        {likes}
      </Text>
    </div>
  );
};

Likes.propTypes = {
  likes: PropTypes.number,
  option: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onLike: PropTypes.func,
  onDislike: PropTypes.func
};

Likes.defaultProps = {
  active: false,
  asyncLoading: true
};

export default Likes;
