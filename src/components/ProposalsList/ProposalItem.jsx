import React from "react";

const ProposalItem = ({ proposal, voteSummary }) => {
  console.log({ proposal, voteSummary });
  return <div>{proposal.name}</div>;
};

export default ProposalItem;
