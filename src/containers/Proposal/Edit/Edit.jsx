import React from "react";
import get from "lodash/fp/get";
import { Card, Message, P } from "pi-ui";
import { useProposal } from "../Detail/hooks";
import { useEditProposal } from "./hooks";
import { withRouter } from "react-router-dom";
import { getMarkdownContent } from "src/containers/Proposal/helpers";
import usePaywall from "src/hooks/api/usePaywall";
import useIdentity from "src/hooks/api/useIdentity";
import Or from "src/components/Or";
import { IdentityMessageError } from "src/components/IdentityErrorIndicators";
import ProposalForm from "src/components/ProposalForm/ProposalFormLazy";
import Link from "src/components/Link";
import ProposalFormLoader from "src/components/ProposalForm/ProposalFormLoader";

const EditProposal = ({ match }) => {
  const tokenFromUrl = get("params.token", match);
  const { proposal, loading } = useProposal(tokenFromUrl);
  const { onEditProposal, currentUser } = useEditProposal();
  const { userid } = currentUser || {};
  const { isPaid } = usePaywall();
  const [, identityError] = useIdentity();

  const initialValues = proposal
    ? {
        token: match.params.token,
        name: proposal.name,
        description: getMarkdownContent(proposal.files),
        files: proposal.files.filter(p => p.name !== "index.md")
      }
    : null;

  return (
    <Card className={"container"}>
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
      {!loading && !!proposal ? (
        <ProposalForm initialValues={initialValues} onSubmit={onEditProposal} />
      ) : (
        <ProposalFormLoader />
      )}
    </Card>
  );
};

export default withRouter(EditProposal);
