import { Message, Card, P } from "pi-ui";
import React from "react";
import ProposalForm from "src/components/ProposalForm/ProposalFormLazy";
import { IdentityMessageError } from "src/components/IdentityErrorIndicators";
import Or from "src/components/Or";
import Link from "src/components/Link";
import usePaywall from "src/hooks/api/usePaywall";
import useIdentity from "src/hooks/api/useIdentity";
import { useNewProposal } from "./hooks";

const NewProposal = () => {
  const {
    onSubmitProposal,
    currentUser
  } = useNewProposal();
  const { userid } = currentUser || {};
  const { isPaid } = usePaywall();
  const [, identityError] = useIdentity();
  return (
    <Card className="container">
      <Or>
        {!isPaid && (
          <Message kind="error">
            <P>
              You won't be able to submit comments or proposals before paying the paywall,
              please visit your <Link to={`/user/${userid}?tab=credits`}>account</Link> page to
              correct this problem.
            </P>
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
