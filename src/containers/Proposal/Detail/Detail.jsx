import React, { useMemo } from "react";
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
import { makeGetProposalName } from "src/selectors";
import { useSelector } from "src/redux";
import { useDocumentTitle } from "src/hooks/utils/useDocumentTitle";
import { GoBackLink } from "src/components/Router";

const ProposalDetail = ({ Main, match, state }) => {
  const tokenFromUrl = get("params.token", match);
  const proposalNameSelector = useMemo(
    () => makeGetProposalName(tokenFromUrl),
    [tokenFromUrl]
  );
  const proposalName = useSelector(proposalNameSelector);
  useDocumentTitle(proposalName);
  const threadParentCommentID = get("params.commentid", match);
  const { proposal, loading, threadParentID, error } = useProposal(
    tokenFromUrl,
    state,
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
