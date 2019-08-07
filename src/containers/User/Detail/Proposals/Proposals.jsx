import React from "react";
import { useUserProposals } from "./hooks";
import Proposal from "src/componentsv2/Proposal";
import HelpMessage from "src/componentsv2/HelpMessage";
import LoadingWithMessage from "src/componentsv2/LoadingWithMessage";

const Proposals = props => {
  const { proposals, loading } = useUserProposals(props);
  const renderProposal = record => {
    return <Proposal key={record.censorshiprecord.token} proposal={record} />;
  };

  const emptyProposalList = !!proposals && proposals.length > 0;
  return !loading ? emptyProposalList ?
      <>{proposals.map(proposal => renderProposal(proposal))}</> :
      <HelpMessage>This user has not created any proposals yet</HelpMessage> :
      <LoadingWithMessage message={"Loading"} spinnerProps={{ invert: true }}/>;
};

export default Proposals;
