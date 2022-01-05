import React, { useCallback } from "react";
import PropTypes from "prop-types";
import {
  Text,
  Icon,
  classNames,
  useMediaQuery,
  useTheme,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
import styles from "./Comment.module.css";
import DateTooltip from "src/components/DateTooltip";
import Markdown from "src/components/Markdown";
import Join from "src/components/Join";
import Link from "src/components/Link";
import LoggedInContent from "src/components/LoggedInContent";
import Likes from "src/components/Likes";
import CopyLink from "src/components/CopyLink";
import { useConfig } from "src/containers/Config";
import { NOJS_ROUTE_PREFIX, PROPOSAL_UPDATE_HINT } from "src/constants";
import { usePolicy } from "src/hooks";
import { useLoaderContext } from "src/containers/Loader";
import CommentForm from "src/components/CommentForm/CommentFormLazy";

const forbiddenCommentsMdElements = ["h1", "h2", "h3", "h4", "h5", "h6"];

const Comment = ({
  className,
  permalink,
  commentID,
  parentID,
  createdAt,
  timestamp,
  version,
  token,
  state,
  author,
  authorID,
  authorUpdateTitle,
  censored,
  sectionId,
  highlightAuthor,
  likesUpCount,
  likesDownCount,
  likeOption,
  disableLikes,
  disableLikesClick,
  onLike,
  onDislike,
  commentBody,
  showReplies,
  disableReply,
  onClickCensor,
  onClickReply,
  onClickShowReplies,
  onEditComment,
  editCommentID,
  setEditCommentID,
  numOfReplies,
  numOfNewHiddenReplies,
  highlightAsNew,
  censorable,
  isFlatMode,
  seeInContextLink,
  ...props
}) => {
  const extraSmall = useMediaQuery("(max-width: 560px)");
  const { javascriptEnabled } = useConfig();

  // Get policy settings & current user id to determine whether the comment
  // is editable.
  const {
    policyComments: { editperiod, allowedits }
  } = usePolicy();
  const { currentUser } = useLoaderContext();
  const { userid } = currentUser || {};

  const currentTimeSec = new Date().getTime() / 1000;
  const isEditable =
    authorID === userid &&
    allowedits &&
    currentTimeSec < createdAt + editperiod;

  const censorButton = !censored && censorable && (
    <Text weight="semibold" className={styles.censor} onClick={onClickCensor}>
      Censor
    </Text>
  );

  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  const showNewReplies =
    numOfNewHiddenReplies > 0 && !showReplies && !isFlatMode;
  const isThread = numOfReplies > 0 && !isFlatMode;

  const authorURL = javascriptEnabled
    ? `/user/${authorID}`
    : `${NOJS_ROUTE_PREFIX}/user/${authorID}`;

  const handleEditComment = useCallback(
    async ({ comment, title }) => {
      // If title is provided then we are dealing with an author
      // update.
      let extraData = "",
        extraDataHint = "";
      if (title) {
        extraDataHint = PROPOSAL_UPDATE_HINT;
        extraData = JSON.stringify({ title });
      }

      await onEditComment({
        commentID,
        comment,
        token,
        parentID,
        state,
        extraData,
        extraDataHint,
        sectionId
      });

      setEditCommentID(null);
    },
    [
      onEditComment,
      commentID,
      parentID,
      state,
      token,
      sectionId,
      setEditCommentID
    ]
  );

  return editCommentID !== commentID ? (
    <div
      className={classNames(
        styles.comment,
        highlightAsNew && styles.highlightAsNew,
        className
      )}
      {...props}>
      <div className={classNames("justify-space-between", styles.info)}>
        <Join>
          <Link
            className={classNames(
              styles.commentAuthor,
              highlightAuthor && styles.recordAuthor
            )}
            to={authorURL}>
            {author}
          </Link>
          <DateTooltip timestamp={timestamp} placement="bottom">
            {({ timeAgo }) => (
              <Link className={styles.timeAgo} to={`${permalink}`}>
                {version > 1 && <span>Edited </span>}
                {timeAgo}
              </Link>
            )}
          </DateTooltip>
          {highlightAsNew && !extraSmall && <Text color="gray">new</Text>}
          {!extraSmall && censorButton}
          {!extraSmall && seeInContextLink}
          {version > 1 && (
            <Text
              id={`comment-${commentID}-version`}
              truncate>{`version ${version}`}</Text>
          )}
          {isEditable && (
            <Icon
              className={styles.editIcon}
              onClick={() => setEditCommentID(commentID)}
              type="edit"
            />
          )}
        </Join>
        {!disableLikes && !censored && (
          <div className={styles.likesWrapper}>
            <Likes
              disabled={disableLikesClick}
              upLikes={likesUpCount}
              downLikes={likesDownCount}
              option={likeOption}
              onLike={onLike}
              onDislike={onDislike}
            />
          </div>
        )}
      </div>
      {extraSmall && censorButton}
      {extraSmall && seeInContextLink}
      {!censored ? (
        <Markdown
          renderImages={false}
          className={classNames(isDarkTheme && "dark", "margin-top-s")}
          body={commentBody}
          disallowedElements={forbiddenCommentsMdElements}
        />
      ) : (
        <Markdown
          renderImages={false}
          className={styles.censored}
          body="Censored by moderators "
        />
      )}
      <div className="justify-space-between margin-top-s">
        <div className="justify-left">
          {!disableReply && (
            <LoggedInContent>
              <Text
                weight="semibold"
                className={styles.reply}
                onClick={onClickReply}>
                Reply
              </Text>
            </LoggedInContent>
          )}
          {isThread && (
            <span className={styles.showReplies} onClick={onClickShowReplies}>
              {showReplies ? "-" : `+${numOfReplies}`}
            </span>
          )}
          {showNewReplies && (
            <Text color="green">{`${numOfNewHiddenReplies} new`}</Text>
          )}
        </div>
        <CopyLink url={window.location.origin + permalink} />
      </div>
    </div>
  ) : (
    <CommentForm
      persistKey={`editing-comment-${commentID}-${token}`}
      className={styles.editForm}
      onSubmit={handleEditComment}
      onCancel={() => setEditCommentID(null)}
      isAuthorUpdate={!!authorUpdateTitle}
      values={{
        comment: commentBody,
        title: authorUpdateTitle
      }}
    />
  );
};

Comment.propTypes = {
  className: PropTypes.string,
  permalink: PropTypes.string,
  commentID: PropTypes.number,
  parentID: PropTypes.number,
  createdAt: PropTypes.number,
  timestamp: PropTypes.number,
  version: PropTypes.number,
  token: PropTypes.string,
  state: PropTypes.number,
  author: PropTypes.string,
  authorID: PropTypes.string,
  authorUpdateTitle: PropTypes.string,
  sectionId: PropTypes.string,
  highlightAuthor: PropTypes.bool,
  disableLikes: PropTypes.bool,
  likesCount: PropTypes.number,
  likesUpCount: PropTypes.number,
  likesDownCount: PropTypes.number,
  likeOption: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disableLikesClick: PropTypes.bool,
  onLike: PropTypes.func,
  onDislike: PropTypes.func,
  commentBody: PropTypes.string,
  showReplies: PropTypes.bool,
  disableReply: PropTypes.bool,
  onClickReply: PropTypes.func,
  onClickShowReplies: PropTypes.func,
  onEditComment: PropTypes.func,
  editCommentID: PropTypes.number,
  setEditCommentID: PropTypes.func,
  numOfReplies: PropTypes.number,
  numOfNewHiddenReplies: PropTypes.number,
  censorable: PropTypes.bool
};

export default React.memo(Comment);
