import { Message, Card } from "pi-ui";
import React from "react";
import ProposalForm from "src/componentsv2/ProposalForm";
import { IdentityMessageError } from "src/componentsv2/IdentityErrorIndicators";
import Or from "src/componentsv2/Or";
import usePaywall from "src/hooks/usePaywall";
import useIdentity from "src/hooks/useIdentity";
import { useNewProposal } from "./hooks";

const NewProposal = () => {
  const { onSubmitProposal } = useNewProposal();
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
        disableSubmit={!isPaid || !!identityError}
        onSubmit={onSubmitProposal}
      />
    </Card>
  );
};

export default NewProposal;
