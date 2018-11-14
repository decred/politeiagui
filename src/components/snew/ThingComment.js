import React from "react";
import { ThingComment as BaseComment } from "snew-classic-ui";
import replyConnector from "../../connectors/reply";
import { PROPOSAL_VOTING_FINISHED } from "../../constants";
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
    console.log("LastVisit", this.props);
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
      userAccessTime,
      lastVisit,
      commentid,
      showCommentForm,
      toggleCommentForm,
      onCloseCommentForm,
      proposalAuthor,
      ...props
    } = this.props;
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
            showCensorLink: !!props.isAdmin && !props.censored,
            showArrows: !props.censored,
            grayBody: props.censored,
            highlightcomment: commentid === props.id,
            showReply: !props.censored,
            onShowReply: toggleCommentForm,
            onCensorComment: this.handleCommentCensor,
            onCloseCommentForm,
            showCommentForm,
            proposalAuthor,
            userAccessTime: lastVisit ? lastVisit : userAccessTime,
            user: loggedInAsEmail,
            authorHref: `/user/${props.authorid}`,
            blockvote:
              keyMismatch ||
              getVoteStatus(token).status === PROPOSAL_VOTING_FINISHED,
            handleVote: onLikeComment,
            token
          }}
        />
      </div>
    );
  }
}

export default replyConnector(ThingComment);
