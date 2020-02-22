import { Message, Card, P } from "pi-ui";
import React from "react";
import ProposalForm from "src/componentsv2/ProposalForm/ProposalFormLazy";
import { IdentityMessageError } from "src/componentsv2/IdentityErrorIndicators";
import Or from "src/componentsv2/Or";
import Link from "src/componentsv2/Link";
import usePaywall from "src/hooks/api/usePaywall";
import useIdentity from "src/hooks/api/useIdentity";
import { useNewProposal } from "./hooks";

const NewProposal = ({ draftId }) => {
  const {
    onSubmitProposal,
    onSaveDraftProposal,
    onDeleteDraftProposal,
    currentUser
  } = useNewProposal();
  const { isPaid } = usePaywall();
  const [, identityError] = useIdentity();
  return (
    <Card className="container">
      <Or>
        {!isPaid && (
          <Message kind="error">
            <P>
              You won't be able to submit comments or proposals before paying the paywall,
              please visit your <Link to={`/user/${currentUser.userid}?tab=credits`}>account</Link> page to
              correct this problem.
            </P>
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
