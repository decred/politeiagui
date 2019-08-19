import React from "react";
import { Spinner } from "pi-ui";
import { useUserProposals } from "./hooks";
import Proposal from "src/componentsv2/Proposal";
import HelpMessage from "src/componentsv2/HelpMessage";

const Proposals = props => {
  const { proposals, loading } = useUserProposals(props);

  const renderProposal = record => {
    return <Proposal key={record.censorshiprecord.token} proposal={record} />;
  };
  const emptyProposalList = !!proposals && proposals.length > 0;
  return !loading ? emptyProposalList ?
      <>{proposals.map(proposal => renderProposal(proposal))}</> :
      <HelpMessage>This user has not created any proposals yet</HelpMessage> :
      <div className="full-height flex-centralize">
        <Spinner invert />
      </div>;
};

export default Proposals;
