import React from "react";
import { ThingComment as BaseComment } from "snew-classic-ui";
import connector from "../../connectors/reply";
import { PROPOSAL_VOTING_NOT_STARTED } from "../../constants";
import Message from "../Message";

class ThingComment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCommentForm: false
    };
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
          onShowReply: this.toggleCommentForm,
          onCloseCommentForm: this.onCloseCommentForm,
          showCommentForm,
          user: loggedInAsEmail,
          authorHref: `/user/${props.authorid}`,
          blockvote: keyMismatch || (getVoteStatus(token).status !== PROPOSAL_VOTING_NOT_STARTED),
          handleVote: onLikeComment,
          token
        }} />
      </div>
    );
  }
}

export default connector(ThingComment);
