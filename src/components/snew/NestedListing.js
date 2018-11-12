import React from "react";
import { NestedListing as BaseListing } from "snew-classic-ui";
import replyConnector from "../../connectors/reply";

const NestedListing = ({ replyTo, ...props }) => (
  <BaseListing
    {...{
      ...props,
      replyTo,
      name: props.name || 0
    }}
  />
);

export default replyConnector(NestedListing);
