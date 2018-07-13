import React from "react";
import { ThingComment as BaseComment } from "snew-classic-ui";
import connector from "../../connectors/reply";
import { PROPOSAL_VOTING_NOT_STARTED } from "../../constants";

const ThingComment = ({
  onSetReplyParent,
  onLikeComment,
  loggedInAsEmail,
  token,
  keyMismatch,
  getVoteStatus,
  ...props
}) => (
  <BaseComment {...{ ...props,
    onShowReply(e) {
      onSetReplyParent(props.id);
      e && e.preventDefault && e.preventDefault();
    },
    user: loggedInAsEmail,
    blockvote: keyMismatch || (getVoteStatus(token).status !== PROPOSAL_VOTING_NOT_STARTED),
    handleVote: onLikeComment,
    token
  }} />
);

export default connector(ThingComment);
