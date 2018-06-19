import React from "react";
import { ThingComment as BaseComment } from "snew-classic-ui";
import connector from "../../connectors/reply";

const ThingComment = ({
  onSetReplyParent,
  onLikeComment,
  loggedInAsEmail,
  token,
  keyMismatch,
  ...props
}) => (
  <BaseComment {...{ ...props,
    onShowReply(e) {
      onSetReplyParent(props.id);
      e && e.preventDefault && e.preventDefault();
    },
    user: loggedInAsEmail,
    blockvote: keyMismatch,
    handleVote: onLikeComment,
    token
  }} />
);

export default connector(ThingComment);
