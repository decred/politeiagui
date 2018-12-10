import React from "react";
import { ThingComment as BaseComment } from "snew-classic-ui";
import replyConnector from "../../connectors/reply";
import {
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_STATUS_ABANDONED
} from "../../constants";
import Message from "../Message";

class ThingComment extends React.PureComponent {
  handlePermalinkClick = e => {
    e && e.preventDefault && e.preventDefault();
    this.props.history.push(
      `/proposals/${this.props.token}/comments/${this.props.id}`
    );
  };
  handleCommentCensor = e => {
    e && e.preventDefault && e.preventDefault();
    this.props.onCensorComment(
      this.props.loggedInAsEmail,
      this.props.token,
      this.props.id
    );
  };
  handleCommentMaxHeight = () => {
    const insertAfter = (newNode, referenceNode) =>
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    const commentsDiv = Array.prototype.slice.call(
      document.querySelectorAll(".entry > .usertext ")
    );
    const overflowDivs = commentsDiv.filter(function isOverflown(element) {
      return (
        element.scrollHeight > element.clientHeight &&
        element.scrollHeight > 530
      );
    });
    overflowDivs.forEach(overflowDiv => {
      const readMore = document.createElement("a");
      readMore.innerHTML = "Read More";
      overflowDiv.className = "collapsed";
      readMore.className += "readMore";
      insertAfter(readMore, overflowDiv);
      readMore.addEventListener("click", () => {
        overflowDiv.classList.toggle("expanded");
      });
      readMore.addEventListener("click", () => {
        readMore.innerHTML === "Read More"
          ? (readMore.innerHTML = "Read less")
          : (readMore.innerHTML = "Read More");
      });
    });
  };
  componentDidMount() {
    this.handleCommentMaxHeight();
  }

  render() {
    const {
      onLikeComment,
      loggedInAsEmail,
      token,
      keyMismatch,
      getVoteStatus,
      likeCommentError,
      likeCommentPayload,
      lastVisit,
      commentid,
      showCommentForm,
      toggleCommentForm,
      onCloseCommentForm,
      proposalAuthor,
      proposalStatus,
      created_utc,
      ...props
    } = this.props;
    const isProposalAbandoned = proposalStatus === PROPOSAL_STATUS_ABANDONED;
    const isNewComment = lastVisit
      ? lastVisit < created_utc && props.authorid !== props.userid
      : false;
    const isCommentPermalink = commentid === props.id;
    return (
      <div>
        {likeCommentError &&
          likeCommentPayload.token === token &&
          likeCommentPayload.commentid === props.id && (
            <Message
              key="comment-vote-error"
              type="error"
              header="Comment vote failed"
              body={likeCommentError}
            />
          )}
        <BaseComment
          {...{
            ...props,
            created_utc,
            showCensorLink: !!props.isAdmin && !props.censored,
            showArrows: !props.censored && !isProposalAbandoned,
            grayBody: props.censored || isProposalAbandoned,
            highlightcomment: isCommentPermalink || isNewComment,
            showReply: !props.censored && !isProposalAbandoned,
            onShowReply: toggleCommentForm,
            onCensorComment: this.handleCommentCensor,
            onCloseCommentForm,
            showCommentForm,
            proposalAuthor,
            isNewComment,
            user: loggedInAsEmail,
            authorHref: `/user/${props.authorid}`,
            blockvote:
              keyMismatch ||
              getVoteStatus(token).status === PROPOSAL_VOTING_FINISHED ||
              isProposalAbandoned,
            handleVote: onLikeComment,
            token
          }}
        />
      </div>
    );
  }
}

export default replyConnector(ThingComment);
