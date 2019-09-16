import React from "react";
import PropTypes from "prop-types";
import { Text, classNames, useMediaQuery } from "pi-ui";
import styles from "./Comment.module.css";
import DateTooltip from "src/componentsv2/DateTooltip";
import Markdown from "src/componentsv2/Markdown";
import Join from "src/componentsv2/Join";
import Link from "src/componentsv2/Link";
import LoggedInContent from "src/componentsv2/LoggedInContent";
import Likes from "src/componentsv2/Likes";
import CopyLink from "src/componentsv2/CopyLink";

const Comment = ({
  className,
  permalink,
  author,
  authorID,
  createdAt,
  censored,
  highlightAuthor,
  likesCount,
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
  numOfReplies,
  numOfNewHiddenReplies,
  highlightAsNew,
  censorable,
  ...props
}) => {
  const extraSmall = useMediaQuery("(max-width: 560px)");

  const censorButton = !censored && censorable && (
    <Text weight="semibold" className={styles.censor} onClick={onClickCensor}>
      Censor
    </Text>
  );

  return (
    <div
      className={classNames(
        styles.commentWrapper,
        highlightAsNew && styles.highlightAsNew,
        className
      )}
      {...props}
    >
      <div className="justify-space-between">
        <Join>
          <Link
            className={classNames(
              styles.commentAuthor,
              highlightAuthor && styles.recordAuthor
            )}
            to={`/user/${authorID}`}
          >
            {author}
          </Link>
          <DateTooltip timestamp={createdAt} placement="bottom">
            {({ timeAgo }) => (
              <Link className={styles.timeAgo} to={permalink} gray>
                {timeAgo}
              </Link>
            )}
          </DateTooltip>
          {highlightAsNew && !extraSmall && <Text color="gray">new</Text>}
          {!extraSmall && censorButton}
        </Join>
        {!disableLikes && (
          <Likes
            disabled={disableLikesClick}
            likes={likesCount}
            option={likeOption}
            onLike={onLike}
            onDislike={onDislike}
          />
        )}
      </div>
      {extraSmall && censorButton}
      {!censored ? (
        <Markdown className="margin-top-s" body={commentBody} />
      ) : (
        <Markdown className={styles.censored} body="Censored by moderators " />
      )}
      <div className="justify-space-between margin-top-s">
        <div className="justify-left">
          {!disableReply && (
            <LoggedInContent>
              <Text
                weight="semibold"
                color="gray"
                className={styles.reply}
                onClick={onClickReply}
              >
                Reply
              </Text>
            </LoggedInContent>
          )}
          {numOfReplies > 0 && (
            <span className={styles.showReplies} onClick={onClickShowReplies}>
              {showReplies ? "-" : `+${numOfReplies}`}
            </span>
          )}
          {numOfNewHiddenReplies > 0 && !showReplies && (
            <Text color="green">{`${numOfNewHiddenReplies} new`}</Text>
          )}
        </div>
        <CopyLink url={window.location.origin + permalink} />
      </div>
    </div>
  );
};

Comment.propTypes = {
  className: PropTypes.string,
  permalink: PropTypes.string,
  topLevelComment: PropTypes.bool,
  author: PropTypes.string,
  authorID: PropTypes.string,
  createdAt: PropTypes.number,
  highlightAuthor: PropTypes.bool,
  disableLikes: PropTypes.bool,
  likesCount: PropTypes.number,
  likeOption: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disableLikesClick: PropTypes.bool,
  onLike: PropTypes.func,
  onDislike: PropTypes.func,
  commentBody: PropTypes.string,
  showReplies: PropTypes.bool,
  disableReply: PropTypes.bool,
  onClickReply: PropTypes.func,
  onClickShowReplies: PropTypes.func,
  numOfReplies: PropTypes.number,
  numOfNewHiddenReplies: PropTypes.number,
  censorable: PropTypes.bool
};

export default React.memo(Comment);
