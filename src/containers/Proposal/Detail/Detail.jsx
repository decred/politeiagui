import React, { useMemo, useCallback } from "react";
import get from "lodash/fp/get";
import { Link, classNames, useTheme } from "pi-ui";
import { withRouter } from "react-router-dom";
import Proposal from "src/componentsv2/Proposal";
import styles from "./Detail.module.css";
import { useProposal } from "./hooks";
import Comments from "src/containers/Comments";
import ProposalLoader from "src/componentsv2/Proposal/ProposalLoader";
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
import useProposalVote from "../hooks/useProposalVote";
import { useRouter } from "src/componentsv2/Router";

const ProposalDetail = ({ Main, match }) => {
  const tokenFromUrl = get("params.token", match);
  const threadParentCommentID = get("params.commentid", match);
  const { proposal, loading, threadParentID } = useProposal(
    tokenFromUrl,
    threadParentCommentID
  );
  const proposalToken = getProposalToken(proposal);

  const { voteSummary } = useProposalVote(proposalToken);

  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";

  const showCommentArea =
    proposal && (isPublicProposal(proposal) || isAbandonedProposal(proposal));
  const canReceiveComments =
    isPublicProposal(proposal) && !isVotingFinishedProposal(voteSummary);

  const { pastLocations, history } = useRouter();
  const previousLocation = pastLocations[1];

  const returnToPreviousLocation = useCallback(() => history.goBack(), [
    history
  ]);

  const goBackLinkFromPreviousLocation = useMemo(() => {
    if (!previousLocation) return null;
    return (
      <div className={styles.returnLinkContainer}>
        <Link
          className={classNames(
            styles.returnLink,
            isDarkTheme && styles.darkReturnLink
          )}
          onClick={returnToPreviousLocation}>
          &#8592; Go back
        </Link>
      </div>
    );
  }, [previousLocation, returnToPreviousLocation, isDarkTheme]);

  return (
    <>
      <Main className={styles.customMain} fillScreen>
        {goBackLinkFromPreviousLocation}
        <UnvettedActionsProvider>
          <PublicActionsProvider>
            {loading || !proposal ? (
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
