import React from "react";
import userConnector from "../../connectors/user";
import { Content as ProposalListing } from "../../components/snew";

const ProposalsTab = ({
  user,
  loggedInAsEmail,
  isAdmin,
  onFetchUserProposals,
  count,
  lastLoadedProposal,
  lastLoadedUserDetailProposal,
  getSubmittedUserProposals,
  isLoadingProposals
}) => {
  return (
    <div className="detail-proposals">
      <ProposalListing
        isLoading={isLoadingProposals}
        loggedInAsEmail={loggedInAsEmail}
        isAdmin={isAdmin}
        count={count}
        userid={user.id}
        lastLoadedProposal={
          lastLoadedProposal && Object.keys(lastLoadedProposal).length > 0
            ? lastLoadedProposal
            : lastLoadedUserDetailProposal
        }
        proposals={getSubmittedUserProposals(user.id)}
        onFetchUserProposals={onFetchUserProposals}
        emptyProposalsMessage={"This user has not submitted any proposals"}
      />
    </div>
  );
};

export default userConnector(ProposalsTab);
