import React from "react";
import { StatusTag } from "pi-ui";
import { getProposalStatusTagProps } from "../../../pi/proposals/utils";

function ProposalStatusTag({ piSummary }) {
  const statusTagProps = getProposalStatusTagProps(piSummary);
  return <StatusTag {...statusTagProps} />;
}

export default ProposalStatusTag;
