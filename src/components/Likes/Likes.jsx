import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { delay } from "lodash";
import {
  Icon,
  useTheme,
  Text,
  getThemeProperty,
  useHover,
  Spinner,
  classNames
} from "pi-ui";
import styles from "./Likes.module.css";

export const isLiked = (action) => action === 1 || action === "1";
export const isDisliked = (action) => action === -1 || action === "-1";

const Likes = ({ upLikes, downLikes, onLike, onDislike, option, disabled, apiLoading }) => {
  const [loading, setLoading] = useState(false);
  const [likeRef, isLikeHovered] = useHover();
  const [dislikeRef, isDislikeHovered] = useHover();
  const { theme } = useTheme();
  const defaultColor = getThemeProperty(theme, "comment-like-color");
  const activeColor = getThemeProperty(theme, "comment-like-color-active");
  const liked = isLiked(option);
  const disliked = isDisliked(option);
  const likeColor = liked || isLikeHovered ? activeColor : defaultColor;
  const dislikeColor =
    disliked || isDislikeHovered ? activeColor : defaultColor;

  useEffect(() => {
    if (apiLoading) {
      delay(() => setLoading(true), 1000);
    } else if (loading) {
      setLoading(false);
    }
  },
    [apiLoading, loading, setLoading]
  );

  const handleLike = useCallback(
    async function handleLike() {
      if (disabled) return;
      await onLike();
    },
    [disabled, onLike]
  );

  const handleDislike = useCallback(
    async function handleDislike() {
      if (disabled) return;
      await onDislike();
    },
    [disabled, onDislike]
  );

  const renderCount = useCallback(
    (count) => (
      <Text
        size="small"
        className={classNames(styles.likesResult, "unselectable")}>
        {count}
      </Text>
    ),
    []
  );

  return (
    <div className="align-center">
      {loading && apiLoading ?  (
        <div className={styles.likeBoxSpinner}>
          <Spinner invert />
        </div>
      ) : (
      <>
        <div className={styles.leftLikeBox}>
          <button
            disabled={disabled}
            ref={likeRef}
            className={styles.likeBtn}
            onClick={handleLike}>
            <Icon
              iconColor={likeColor}
              backgroundColor={likeColor}
              type="like"
            />
          </button>
          {renderCount(upLikes)}
        </div>
        <div className={styles.rightLikeBox}>
          <button
            disabled={disabled}
            ref={dislikeRef}
            className={styles.likeBtn}
            onClick={handleDislike}>
            <Icon
              iconColor={dislikeColor}
              backgroundColor={dislikeColor}
              type="dislike"
            />
          </button>
          {renderCount(downLikes)}
        </div>
      </>
      )}
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
