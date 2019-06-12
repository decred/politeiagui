import React from "react";
import { useNewProposal } from "./hooks";
import ProposalForm from "src/componentsv2/ProposalForm";

const NewProposal = () => {
  const { onSubmitProposal } = useNewProposal();

  return <ProposalForm onSubmit={onSubmitProposal} />;
};

export default NewProposal;
