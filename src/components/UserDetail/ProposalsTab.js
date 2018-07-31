import React from "react";
import userConnector from "../../connectors/user";
import { Content as ProposalListing } from "../../components/snew";


const ProposalsTab = ({
  user,
  loggedInAsEmail,
  isAdmin
}) => (
  <div className="detail-proposals">
    <ProposalListing
      loggedInAsEmail={loggedInAsEmail}
      isAdmin={isAdmin}
      proposals={user.proposals}
      emptyProposalsMessage={"This user has not submitted any proposals"} />
  </div>
);

export default userConnector(ProposalsTab);
