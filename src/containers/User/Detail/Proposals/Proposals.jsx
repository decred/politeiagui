import React from "react";
import { Spinner } from "pi-ui";
import { useUserProposals } from "./hooks";
import Proposal from "src/componentsv2/Proposal";

const Proposals = props => {
  const { proposals, loading } = useUserProposals(props);

  const renderProposal = record => {
    return <Proposal key={record.censorshiprecord.token} proposal={record} />;
  };

  // TODO: need a loading while user has not been fetched yet
  return !!proposals && !loading ? (
    <>{proposals.map(proposal => renderProposal(proposal))}</>
  ) : (
    <div className="full-height flex-centralize">
      <Spinner invert />
    </div>
  );
};

export default Proposals;
