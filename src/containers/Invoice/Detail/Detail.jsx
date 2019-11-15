import React from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/fp/get";
import { useInvoice } from "./hooks";
import Invoice from "src/componentsv2/Invoice";
// import Proposal from "src/componentsv2/Proposal";
// import styles from "./Detail.module.css";
// import { useProposal } from "./hooks";
// import Comments from "src/containers/Comments";
// import ProposalLoader from "src/componentsv2/Proposal/ProposalLoader";
// import { getCommentBlockedReason } from "./helpers";
// import {
//   isPublicProposal,
//   isAbandonedProposal,
//   isVotingFinishedProposal
// } from "../helpers";
// import {
//   UnvettedActionsProvider,
//   PublicActionsProvider
// } from "src/containers/Proposal/Actions";
// import { useProposalVote } from "../hooks";

const InvoiceDetail = ({ Main, match }) => {
  const invoiceToken = get("params.token", match);

  const { invoice, loading } = useInvoice(invoiceToken);

  //   const { proposal, loading, threadParentID } = useProposal({ match });
  //   const proposalToken =
  //     proposal && proposal.censorshiprecord && proposal.censorshiprecord.token;
  //   const { voteSummary } = useProposalVote(proposalToken);

  //   const showCommentArea =
  //     proposal && (isPublicProposal(proposal) || isAbandonedProposal(proposal));
  //   const canReceiveComments =
  //     isPublicProposal(proposal) && !isVotingFinishedProposal(voteSummary);

  return (
    <>
      <Main fillScreen>
        {!!invoice && <Invoice invoice={invoice} extended />}
        {/* <UnvettedActionsProvider>
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
          </PublicActionsProvider> */}
        {/* </UnvettedActionsProvider> */}
      </Main>
    </>
  );
};

export default withRouter(InvoiceDetail);
