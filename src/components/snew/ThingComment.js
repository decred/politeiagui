import React from "react";
import { ThingComment as BaseComment } from "snew-classic-ui";
import replyConnector from "../../connectors/reply";
import { PROPOSAL_VOTING_FINISHED } from "../../constants";
import Message from "../Message";

class ThingComment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCommentForm: false
    };
  }
  handleCommentCensor = (e) => {
    e && e.preventDefault && e.preventDefault();
    this.props.onCensorComment(this.props.loggedInAsEmail, this.props.token, this.props.id);
  }
  toggleCommentForm = (e, forceValue = null) => {
    e && e.preventDefault && e.preventDefault();
    this.setState({
      showCommentForm: forceValue != null ? forceValue : !this.state.showCommentForm
    });
  }
  onCloseCommentForm = () => this.toggleCommentForm(null, false)
  render() {
    const {
      onLikeComment,
      loggedInAsEmail,
      token,
      keyMismatch,
      getVoteStatus,
      likeCommentError,
      likeCommentPayload,
      ...props
    } = this.props;
    const { showCommentForm } = this.state;
    return (
      <div>
        {likeCommentError && likeCommentPayload.token === token
          && likeCommentPayload.commentid === props.id &&
          <Message
            key="comment-vote-error"
            type="error"
            header="Comment vote failed"
            body={likeCommentError}
          />
        }
        <BaseComment {...{
          ...props,
          showCensorLink: !!props.isAdmin,
          onShowReply: this.toggleCommentForm,
          onCensorComment: this.handleCommentCensor,
          onCloseCommentForm: this.onCloseCommentForm,
          showCommentForm,
          user: loggedInAsEmail,
          authorHref: `/user/${props.authorid}`,
          blockvote: keyMismatch || (getVoteStatus(token).status === PROPOSAL_VOTING_FINISHED),
          handleVote: onLikeComment,
          token
        }} />
      </div>
    );
  }
}

export default replyConnector(ThingComment);
