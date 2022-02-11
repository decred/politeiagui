import React from "react";
import { StatusTag } from "pi-ui";
import { getProposalStatusTagProps } from "../utils";

function ProposalStatusTag({ record, voteSummary }) {
  const statusTagProps = getProposalStatusTagProps(record, voteSummary);
  return <StatusTag {...statusTagProps} />;
}

export default ProposalStatusTag;
