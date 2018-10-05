import React from "react";
import userConnector from "../../connectors/user";
import { Content as ProposalListing } from "../../components/snew";
import { removeProposalsDuplicates } from "../../helpers";

const ProposalsTab = ({
  user,
  loggedInAsEmail,
  isAdmin,
  onFetchUserProposals,
  loggedInAsUserId,
  userProposals,
  count,
  lastLoadedProposal,
  lastLoadedUserDetailProposal
}) => {
  const proposals = removeProposalsDuplicates(user.proposals, userProposals);
  return (
    <div className="detail-proposals">
      <ProposalListing
        loggedInAsEmail={loggedInAsEmail}
        isAdmin={isAdmin}
        count={count}
        userid={loggedInAsUserId}
        lastLoadedProposal={lastLoadedProposal && Object.keys(lastLoadedProposal).length > 0 ? lastLoadedProposal : lastLoadedUserDetailProposal}
        proposals={proposals}
        onFetchUserProposals={onFetchUserProposals}
        emptyProposalsMessage={"This user has not submitted any proposals"} />
    </div>
  );
};

export default userConnector(ProposalsTab);
