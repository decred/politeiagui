import { Message, Card } from "pi-ui";
import React from "react";
import ProposalForm from "src/componentsv2/ProposalForm";
import { IdentityMessageError } from "src/componentsv2/IdentityErrorIndicators";
import Or from "src/componentsv2/Or";
import usePaywall from "src/hooks/api/usePaywall";
import useIdentity from "src/hooks/api/useIdentity";
import { useNewProposal } from "./hooks";

const NewProposal = ({ draftId }) => {
  const {
    onSubmitProposal,
    onSaveDraftProposal,
    onDeleteDraftProposal
  } = useNewProposal();
  const { isPaid } = usePaywall();
  const [, identityError] = useIdentity();
  return (
    <Card className="container">
      <Or>
        {!isPaid && (
          <Message kind="error">
            You must pay the paywall to create a proposal
          </Message>
        )}
        {!!identityError && <IdentityMessageError />}
      </Or>
      <ProposalForm
        draftId={draftId}
        disableSubmit={!isPaid || !!identityError}
        onSubmit={onSubmitProposal}
        onSaveDraft={onSaveDraftProposal}
        onDeleteDraft={onDeleteDraftProposal}
      />
    </Card>
  );
};

export default NewProposal;
