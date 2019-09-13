import React, { useMemo, useCallback } from "react";
import { Link } from "pi-ui";
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
  isVotingFinishedProposal
} from "../helpers";
import {
  UnvettedActionsProvider,
  PublicActionsProvider
} from "src/containers/Proposal/Actions";
import { useProposalVote } from "../hooks";
import { useRouter } from "src/componentsv2/Router";

const ProposalDetail = ({ TopBanner, PageDetails, Sidebar, Main, match }) => {
  const { proposal, loading, threadParentID } = useProposal({ match });
  const proposalToken =
    proposal && proposal.censorshiprecord && proposal.censorshiprecord.token;
  const { voteStatus } = useProposalVote(proposalToken);

  const showCommentArea =
    proposal && (isPublicProposal(proposal) || isAbandonedProposal(proposal));
  const canReceiveComments =
    isPublicProposal(proposal) && !isVotingFinishedProposal(voteStatus);

  const { pastLocations, history } = useRouter();

  const previousLocation = pastLocations[1];

  const returnToPreviousLocation = useCallback(() => history.goBack(), [
    history
  ]);

  const goBackLinkFromPreviousLocation = useMemo(() => {
    if (!previousLocation) return null;
    let message = "";

    switch (previousLocation.pathname) {
      case "/":
        message = "Go back to public proposals";
        break;
      case "/proposals/unvetted":
        message = "Go back to unvetted proposals";
        break;
      default:
        if (previousLocation.pathname.match("/user/*")) {
          message = "Go back to user account";
        }
        break;
    }

    if (!message) return null;

    return (
      <Link
        gray
        className={styles.returnLink}
        onClick={returnToPreviousLocation}
      >
        &#8592; {message}
      </Link>
    );
  }, [previousLocation, returnToPreviousLocation]);

  return (
    <>
      <TopBanner>
        <PageDetails
          title={"Proposal Details"}
          subtitle={goBackLinkFromPreviousLocation}
        />
      </TopBanner>
      <Sidebar />
      <Main className={styles.customMain}>
        <UnvettedActionsProvider>
          <PublicActionsProvider>
            {loading || !proposal ? (
              <ProposalLoader extended />
            ) : (
              <Proposal proposal={proposal} extended />
            )}
            {showCommentArea && (
              <Comments
                recordAuthorID={proposal.userid}
                recordToken={proposalToken}
                numOfComments={proposal.numcomments}
                threadParentID={threadParentID}
                readOnly={!canReceiveComments}
                readOnlyReason={getCommentBlockedReason(proposal, voteStatus)}
              />
            )}
          </PublicActionsProvider>
        </UnvettedActionsProvider>
      </Main>
    </>
  );
};

export default withRouter(ProposalDetail);
