import React from "react";
import { useProposal } from "../Detail/hooks";
import { useEditProposal } from "./hooks";
import { withRouter } from "react-router-dom";
import { getMarkdownContent } from "src/componentsv2/Proposal/helpers";

import ProposalForm from "src/componentsv2/ProposalForm";

const EditProposal = ({ match }) => {
    const { proposal, loading } = useProposal({ match });
    const { onEditProposal } = useEditProposal();

    const initialValues = proposal ? {
      token: match.params.token,
      name: proposal.name,
      description: getMarkdownContent(proposal.files),
      files: proposal.files.filter(p => p.name !== "index.md")
    } : {};

    return !!proposal && !loading ? (
      <ProposalForm 
        initialValues={initialValues} 
        onSubmit={onEditProposal} 
      />
    ) : null;
};

export default withRouter(EditProposal);