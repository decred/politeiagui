import React from "react";
import { Message } from "pi-ui";
import get from "lodash/fp/get";
import { withRouter } from "react-router-dom";
import Proposal from "src/components/Proposal";
import styles from "./Detail.module.css";
import { useProposal } from "./hooks";
import Comments from "src/containers/Comments";
import ProposalLoader from "src/components/Proposal/ProposalLoader";
import { getCommentBlockedReason } from "./helpers";
import {
  isVotingFinishedProposal,
  getProposalToken,
  isCensoredProposal,
  isAbandonedProposal,
  getProposalLink
} from "../helpers";
import {
  UnvettedActionsProvider,
  PublicActionsProvider
} from "src/containers/Proposal/Actions";
import { useProposalVote } from "../hooks";
import useDocumentTitle from "src/hooks/utils/useDocumentTitle";
import useProposalsStatusChangeUser from "src/hooks/api/useProposalsStatusChangeUser";
import { GoBackLink } from "src/components/Router";
import { useConfig } from "src/containers/Config";
import { PROPOSAL_STATUS_CENSORED } from "src/constants";

const SetPageTitle = ({ title }) => {
  useDocumentTitle(title);
  return null;
};

const ProposalDetail = ({ Main, match }) => {
  const tokenFromUrl = get("params.token", match);
  const threadParentCommentID = get("params.commentid", match);
  const {
    proposal: fetchedProposal,
    loading,
    threadParentID,
    error
  } = useProposal(tokenFromUrl, threadParentCommentID);
  const { proposals, loading: mdLoading } = useProposalsStatusChangeUser(
    { [tokenFromUrl]: fetchedProposal },
    PROPOSAL_STATUS_CENSORED
  );
  const proposal = proposals[tokenFromUrl];
  const proposalToken = getProposalToken(proposal);
  const { voteSummary } = useProposalVote(proposalToken || tokenFromUrl);
  const canReceiveComments =
    !isVotingFinishedProposal(voteSummary) && !isAbandonedProposal(proposal);
  const { javascriptEnabled } = useConfig();

  return (
    <>
      <Main className={styles.customMain} fillScreen>
        <GoBackLink />
        {proposal && <SetPageTitle title={proposal.name} />}
        <UnvettedActionsProvider>
          <PublicActionsProvider>
            {error ? (
              <Message kind="error">{error.toString()}</Message>
            ) : loading || mdLoading || !proposal ? (
              <ProposalLoader extended />
            ) : (
              <Proposal
                proposal={proposal}
                extended
                collapseBodyContent={!!threadParentID}
              />
            )}
            {!isCensoredProposal(proposal) && (
              <Comments
                recordAuthorID={proposal?.userid}
                recordAuthorUsername={proposal?.username}
                recordToken={tokenFromUrl}
                recordTokenFull={proposalToken}
                numOfComments={proposal?.comments}
                threadParentID={threadParentID}
                readOnly={!canReceiveComments}
                readOnlyReason={getCommentBlockedReason(proposal, voteSummary)}
                proposalState={proposal?.state}
                recordBaseLink={getProposalLink(proposal, javascriptEnabled)}
              />
            )}
          </PublicActionsProvider>
        </UnvettedActionsProvider>
      </Main>
    </>
  );
};

export default withRouter(ProposalDetail);
