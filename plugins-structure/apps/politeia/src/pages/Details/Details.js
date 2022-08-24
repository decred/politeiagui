import React from "react";
import { Message } from "pi-ui";
import {
  SingleContentPage,
  useScrollToTop,
} from "@politeiagui/common-ui/layout";
import { Comments } from "@politeiagui/comments/ui";
import { ProposalDetails, ProposalLoader } from "../../components";
import styles from "./styles.module.css";
import useProposalDetails from "./useProposalDetails";
import { getURLSearchParams } from "../../utils/getURLSearchParams";

function ErrorsMessages({ errors }) {
  return errors.reduce((acc, cur) => {
    if (cur) {
      return [
        ...acc,
        <Message kind="error" data-testid="proposal-details-error">
          {cur}
        </Message>,
      ];
    }
    return acc;
  }, []);
}

function Details({ token }) {
  const {
    comments,
    detailsStatus,
    fullToken,
    onFetchRecordTimestamps,
    onFetchCommentsTimestamps,
    proposalSummary,
    record,
    voteSummary,
    recordDetailsError,
    voteSummaryError,
    commentsError,
    billingStatusChange,
    proposalStatusChanges,
  } = useProposalDetails({ token });
  // TODO: this can be moved somewhere else
  const params = getURLSearchParams();
  const shouldScrollToComments = !!params?.scrollToComments;
  useScrollToTop(shouldScrollToComments);
  return (
    <SingleContentPage className={styles.detailsWrapper}>
      {detailsStatus === "loading" && <ProposalLoader isDetails />}
      {detailsStatus === "failed" && (
        <ErrorsMessages
          errors={[recordDetailsError, voteSummaryError, commentsError]}
        />
      )}
      {fullToken && record && detailsStatus === "succeeded" && (
        <>
          <ProposalDetails
            record={record}
            voteSummary={voteSummary}
            proposalSummary={proposalSummary}
            billingStatusChange={billingStatusChange}
            proposalStatusChanges={proposalStatusChanges}
            onFetchRecordTimestamps={onFetchRecordTimestamps}
            onFetchCommentsTimestamps={onFetchCommentsTimestamps}
          />
          {comments && (
            <Comments
              comments={comments}
              // Mocking onReply until user layer is done.
              onReply={(comment, parentid) => {
                console.log(`Replying ${parentid}:`, comment);
              }}
              scrollOnLoad={shouldScrollToComments}
            />
          )}
        </>
      )}
    </SingleContentPage>
  );
}

export default Details;
