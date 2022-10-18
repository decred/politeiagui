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
import { GoBackLink } from "@politeiagui/common-ui";

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
    onDownloadCommentsBundle,
    proposalSummary,
    record,
    voteSummary,
    recordDetailsError,
    voteSummaryError,
    commentsError,
    proposalStatusChanges,
    rfpLinkedRecord,
    rfpSubmissionsRecords,
    rfpSubmissionsCommentsCounts,
    rfpSubmissionsProposalsSummaries,
    rfpSumbissionsVoteSummaries,
  } = useProposalDetails({ token });
  // TODO: this can be moved somewhere else
  const params = getURLSearchParams();
  const shouldScrollToComments = !!params?.scrollToComments;
  useScrollToTop(shouldScrollToComments);
  return (
    <SingleContentPage className={styles.detailsWrapper}>
      <GoBackLink />
      {detailsStatus === "loading" && <ProposalLoader isDetails />}
      {detailsStatus === "failed" && (
        <ErrorsMessages
          errors={[recordDetailsError, voteSummaryError, commentsError]}
        />
      )}
      {fullToken &&
        record &&
        detailsStatus === "succeeded" &&
        record.detailsFetched && (
          <>
            <ProposalDetails
              record={record}
              rfpRecord={rfpLinkedRecord}
              voteSummary={voteSummary}
              proposalSummary={proposalSummary}
              proposalStatusChanges={proposalStatusChanges}
              onFetchRecordTimestamps={onFetchRecordTimestamps}
              onFetchCommentsTimestamps={onFetchCommentsTimestamps}
              onDownloadCommentsBundle={onDownloadCommentsBundle}
              rfpSubmissionsRecords={rfpSubmissionsRecords}
              rfpSubmissionsCommentsCounts={rfpSubmissionsCommentsCounts}
              rfpSubmissionsProposalSummaries={rfpSubmissionsProposalsSummaries}
              rfpSubmissionsVoteSummaries={rfpSumbissionsVoteSummaries}
            />
            {comments && (
              <Comments
                comments={comments}
                recordOwner={record.username}
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
