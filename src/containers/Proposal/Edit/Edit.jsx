import React from "react";
import { Card, Message } from "pi-ui";
import { useProposal } from "../Detail/hooks";
import { useEditProposal } from "./hooks";
import { withRouter } from "react-router-dom";
import { getMarkdownContent } from "src/componentsv2/Proposal/helpers";
import usePaywall from "src/hooks/api/usePaywall";
import useIdentity from "src/hooks/api/useIdentity";
import Or from "src/componentsv2/Or";
import { IdentityMessageError } from "src/componentsv2/IdentityErrorIndicators";
import ProposalForm from "src/componentsv2/ProposalForm";

const EditProposal = ({ match }) => {
  const { proposal, loading } = useProposal({ match });
  const { onEditProposal } = useEditProposal();
  const { isPaid } = usePaywall();
  const [, identityError] = useIdentity();

  const initialValues =
    proposal && !!proposal.files.length
      ? {
          token: match.params.token,
          name: proposal.name,
          description: getMarkdownContent(proposal.files),
          files: proposal.files.filter(p => p.name !== "index.md")
        }
      : {};

  return !!proposal && !loading ? (
    <Card className="container">
      <Or>
        {!isPaid && (
          <Message kind="error">
            You must pay the paywall to create a proposal
          </Message>
        )}
        {!!identityError && <IdentityMessageError />}
      </Or>
      <ProposalForm initialValues={initialValues} onSubmit={onEditProposal} />
    </Card>
  ) : null;
};

export default withRouter(EditProposal);
