import React from "react";
import { NestedListing as BaseListing } from "snew-classic-ui";
import connector from "../../connectors/reply";

const NestedListing = ({ replyTo, ...props }) => (
  <BaseListing {...{
    ...props,
    replyTo,
    name: props.name || 0,
    showReplyForm: (replyTo === props.name) || (!props.name && !replyTo && !props.locked)
  }} />
);

export default connector(NestedListing);
