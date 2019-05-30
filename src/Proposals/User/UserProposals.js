import React from "react";
import { useUserProposals } from "./hooks";
import { withRouter } from "react-router-dom";
import { Content as ProposalListing } from "src/components/snew";

export const UserProposals = withRouter(props => {
  return (
    <div className="page content">
      <ProposalListing {...props} {...useUserProposals(props)} />
    </div>
  );
});
