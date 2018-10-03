import React from "react";
import userConnector from "../../connectors/user";
import { Content as ProposalListing } from "../../components/snew";

const removeDuplicates = (arr1, arr2) => {
  const proposalsObj = arr1 ? arr1.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.censorshiprecord.token]: cur
    };
  }, {}) : {};
  const payloadProposalsObj = arr2 ? arr2.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.censorshiprecord.token]: cur
    };
  }, {}) : {};
  const mergedProposalsObj = {
    ...proposalsObj,
    ...payloadProposalsObj
  };
  return Object.keys(mergedProposalsObj).map(prop => mergedProposalsObj[prop]);
};

const ProposalsTab = ({
  user,
  loggedInAsEmail,
  isAdmin,
  onFetchUserProposals,
  lastLoadedProposal,
  loggedInAsUserId,
  userProposals,
  count
}) => (
  <div className="detail-proposals">
    <ProposalListing
      loggedInAsEmail={loggedInAsEmail}
      isAdmin={isAdmin}
      count={count}
      userid={loggedInAsUserId}
      lastLoadedProposal={lastLoadedProposal}
      proposals={removeDuplicates(user.proposals, userProposals)}
      onFetchUserProposals={onFetchUserProposals}
      emptyProposalsMessage={"This user has not submitted any proposals"} />
  </div>
);

export default userConnector(ProposalsTab);
