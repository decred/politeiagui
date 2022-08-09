import React from "react";
import { StatusTag } from "pi-ui";
import { getProposalStatusTagProps } from "../../../pi/proposals/utils";

function ProposalStatusTag({ proposalSummary }) {
  const { text, type } = getProposalStatusTagProps(proposalSummary);
  return <StatusTag text={text} type={type} />;
}

export default ProposalStatusTag;
