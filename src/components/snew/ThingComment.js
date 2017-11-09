import React from "react";
import { ThingComment as BaseComment } from "snew-classic-ui";
import connector from "../../connectors/reply";

const ThingComment = ({ onSetReplyParent, ...props }) => (
  <BaseComment {...{ ...props,
    onShowReply(e) {
      onSetReplyParent(props.id);
      e && e.preventDefault && e.preventDefault();
    }
  }} />
);

export default connector(ThingComment);
