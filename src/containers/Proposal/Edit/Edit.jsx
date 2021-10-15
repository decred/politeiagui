import React from "react";
import get from "lodash/fp/get";
import { Card, Message, P } from "pi-ui";
import { useProposal } from "../Detail/hooks";
import { withRouter } from "react-router-dom";
import { useEditProposal } from "./hooks";
import usePaywall from "src/hooks/api/usePaywall";
import useIdentity from "src/hooks/api/useIdentity";
import Or from "src/components/Or";
import IdentityMessageError from "src/components/IdentityMessageError";
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
import { getAttachmentsFiles } from "src/helpers";
import { usdFormatter } from "src/utils";

const EditProposal = ({ match }) => {
  const tokenFromUrl = get("params.token", match);
  const { proposal, loading } = useProposal(tokenFromUrl);
  const isPublic = isPublicProposal(proposal);
  const { onEditProposal, currentUser } = useEditProposal();
  const { userid } = currentUser || {};
  const { isPaid, paywallEnabled } = usePaywall();
  const [, identityError] = useIdentity();
  const hasDetails =
    proposal?.files.filter((f) => f.name === "index.md").length > 0;

  const initialValues = proposal
    ? {
        token: proposal.censorshiprecord.token,
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
        files: getAttachmentsFiles(proposal.files),
        amount: proposal.amount
          ? `${usdFormatter.format(proposal.amount)}`
          : undefined,
        startDate:
          proposal.startDate && formatUnixTimestampToObj(proposal.startDate),
        endDate: proposal.endDate && formatUnixTimestampToObj(proposal.endDate),
        domain: proposal.domain
      }
    : null;

  return (
    <Card className="container">
      <Or>
        {!isPaid && paywallEnabled && (
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
      {!loading && !!proposal && hasDetails ? (
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
