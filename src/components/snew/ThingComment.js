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
  handleToggleReadComment = e => {
    e && e.preventDefault && e.preventDefault();
    const { readComments, id, onSetReadComments, token } = this.props;
    if (!readComments.find(cid => cid === id)) {
      onSetReadComments(token, [...readComments, id]);
    } else {
      const newReadComments = readComments.filter(
        commentid => commentid !== id
      );
      onSetReadComments(token, newReadComments);
    }
  };

  handleLikeComment = (loggedInAsEmail, token, commentid, action) => {
    const { readComments, onSetReadComments, onLikeComment } = this.props;
    if (!readComments.find(cid => cid === commentid) && loggedInAsEmail) {
      onSetReadComments(token, [...readComments, commentid]);
    }
    onLikeComment(loggedInAsEmail, token, commentid, action);
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
      loggedInAsEmail,
      token,
      keyMismatch,
      getVoteStatus,
      likeCommentError,
      likeCommentPayload,
      commentid,
      showCommentForm,
      toggleCommentForm,
      onCloseCommentForm,
      proposalAuthor,
      proposalStatus,
      created_utc,
      readComments,
      ...props
    } = this.props;
    const isProposalAbandoned = proposalStatus === PROPOSAL_STATUS_ABANDONED;
    const isCommentRead = readComments.find(id => id === props.id);
    const isCommentUnread = !isCommentRead;
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
            highlightcomment: isCommentPermalink,
            showReply: !props.censored && !isProposalAbandoned,
            onShowReply: toggleCommentForm,
            onCensorComment: this.handleCommentCensor,
            onToggleMarkAsRead: this.handleToggleReadComment,
            onCloseCommentForm,
            showCommentForm,
            proposalAuthor,
            isCommentUnread,
            user: loggedInAsEmail,
            authorHref: `/user/${props.authorid}`,
            blockvote:
              keyMismatch ||
              getVoteStatus(token).status === PROPOSAL_VOTING_FINISHED ||
              isProposalAbandoned,
            handleVote: this.handleLikeComment,
            token
          }}
        />
      </div>
    );
  }
}

export default replyConnector(ThingComment);
