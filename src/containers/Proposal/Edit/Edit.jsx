import React from "react";
import get from "lodash/fp/get";
import { Card, Message, P } from "pi-ui";
import { useProposal } from "../Detail/hooks";
import { withRouter } from "react-router-dom";
import { useEditProposal } from "./hooks";
import usePaywall from "src/hooks/api/usePaywall";
import useIdentity from "src/hooks/api/useIdentity";
import Or from "src/components/Or";
import { IdentityMessageError } from "src/components/IdentityErrorIndicators";
import ProposalForm from "src/components/ProposalForm/ProposalFormLazy";
import Link from "src/components/Link";
import ProposalFormLoader from "src/components/ProposalForm/ProposalFormLoader";
import {
  PROPOSAL_TYPE_REGULAR,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION
} from "src/constants";
import { getMarkdownContent, isPublicProposal } from "../helpers";
import { formatUnixTimestampToObj } from "src/utils";

const EditProposal = ({ match }) => {
  const tokenFromUrl = get("params.token", match);
  // XXX what about propsoal state here ?
  const { proposal, loading } = useProposal(tokenFromUrl);
  console.log({ proposal });
  const isPublic = isPublicProposal(proposal);
  const { onEditProposal, currentUser } = useEditProposal();
  const { userid } = currentUser || {};
  const { isPaid } = usePaywall();
  const [, identityError] = useIdentity();
  const initialValues = proposal
    ? {
        token: match.params.token,
        name: proposal.name,
        type:
          proposal && proposal.linkby
            ? PROPOSAL_TYPE_RFP
            : proposal.linkto
            ? PROPOSAL_TYPE_RFP_SUBMISSION
            : PROPOSAL_TYPE_REGULAR,
        rfpDeadline:
          proposal.linkby && formatUnixTimestampToObj(proposal.linkby),
        rfpLink: proposal.linkto,
        description: getMarkdownContent(proposal.files),
        files: proposal.files.filter(
          (p) => p.name !== "index.md" && p.name !== "data.json"
        )
      }
    : null;

  return (
    <Card className={"container"}>
      <Or>
        {!isPaid && (
          <Message kind="error">
            <P>
              You won't be able to submit comments or proposals before paying
              the paywall, please visit your{" "}
              <Link to={`/user/${userid}?tab=credits`}>account</Link> page to
              correct this problem.
            </P>
          </Message>
        )}
        {!!identityError && <IdentityMessageError />}
      </Or>
      {!loading && !!proposal ? (
        <ProposalForm
          initialValues={initialValues}
          onSubmit={onEditProposal}
          isPublic={isPublic}
        />
      ) : (
        <ProposalFormLoader />
      )}
    </Card>
  );
};

export default withRouter(EditProposal);
