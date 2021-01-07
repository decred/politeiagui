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
  isPublicProposal,
  isAbandonedProposal,
  isVotingFinishedProposal,
  getProposalToken
} from "../helpers";
import {
  UnvettedActionsProvider,
  PublicActionsProvider
} from "src/containers/Proposal/Actions";
import { useProposalVote } from "../hooks";
import useDocumentTitle from "src/hooks/utils/useDocumentTitle";
import { GoBackLink } from "src/components/Router";

const SetPageTitle = ({ title }) => {
  useDocumentTitle(title);
  return null;
};

const ProposalDetail = ({ Main, match }) => {
  const tokenFromUrl = get("params.token", match);
  const threadParentCommentID = get("params.commentid", match);
  const { proposal, loading, threadParentID, error } = useProposal(
    tokenFromUrl,
    threadParentCommentID
  );
  const proposalToken = getProposalToken(proposal);
  const { voteSummary } = useProposalVote(proposalToken);
  const showCommentArea =
    proposal && (isPublicProposal(proposal) || isAbandonedProposal(proposal));
  const canReceiveComments =
    isPublicProposal(proposal) && !isVotingFinishedProposal(voteSummary);

  return (
    <>
      <Main className={styles.customMain} fillScreen>
        <GoBackLink />
        {proposal && <SetPageTitle title={proposal.name} />}
        <UnvettedActionsProvider>
          <PublicActionsProvider>
            {error ? (
              <Message kind="error">{error.toString()}</Message>
            ) : loading || !proposal ? (
              <ProposalLoader extended />
            ) : (
              <Proposal
                proposal={proposal}
                extended
                collapseBodyContent={!!threadParentID}
              />
            )}
            {showCommentArea && (
              <Comments
                recordAuthorID={proposal.userid}
                recordToken={proposalToken}
                numOfComments={proposal.numcomments}
                threadParentID={threadParentID}
                readOnly={!canReceiveComments}
                readOnlyReason={getCommentBlockedReason(proposal, voteSummary)}
              />
            )}
          </PublicActionsProvider>
        </UnvettedActionsProvider>
      </Main>
    </>
  );
};

export default withRouter(ProposalDetail);
