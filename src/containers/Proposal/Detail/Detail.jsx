import React from "react";
import { withRouter } from "react-router-dom";
import Proposal from "src/componentsv2/Proposal";
import styles from "./Detail.module.css";
import { useProposal } from "./hooks";
import Comments from "src/containers/Comments";
import ProposalLoader from "src/componentsv2/Proposal/ProposalLoader";
import { proposalCanReceiveComments, getCommentBlockedReason } from "./helpers";
import {
  isPublicProposal,
  isAbandonedProposal
} from "src/componentsv2/Proposal/helpers";

const ProposalDetail = ({ TopBanner, PageDetails, Sidebar, Main, match }) => {
  const { proposal, loading, threadParentID } = useProposal({ match });
  const proposalToken =
    proposal && proposal.censorshiprecord && proposal.censorshiprecord.token;
  const showCommentArea =
    proposal && (isPublicProposal(proposal) || isAbandonedProposal(proposal));
  return (
    <>
      <TopBanner>
        <PageDetails
          title={"Proposal Details"}
          headerClassName="no-margin-top"
        />
      </TopBanner>
      <Sidebar />
      <Main className={styles.customMain}>
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
            readOnly={!proposalCanReceiveComments(proposal)}
            readOnlyReason={getCommentBlockedReason(proposal)}
          />
        )}
      </Main>
    </>
  );
};

export default withRouter(ProposalDetail);
