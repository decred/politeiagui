import React from "react";
import { useProposal } from "../Detail/hooks";
import { useEditProposal } from "./hooks";
import { withRouter } from "react-router-dom";
import { getTextFromIndexMd } from "src/helpers";

import ProposalForm from "src/componentsv2/ProposalForm";

const EditProposal = ({ match }) => {
    const { proposal, loading } = useProposal({ match });
    const { onEditProposal } = useEditProposal();

    const markdownFile = proposal ? 
      proposal.files.find(f => f.name === "index.md") : [];

    const initialValues = proposal ? {
      token: match.params.token,
      name: proposal.name,
      description: getTextFromIndexMd(markdownFile),
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