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
import { keyCommentsThreadsBy } from "@politeiagui/comments/utils";

function ErrorsMessages({ errors }) {
  return errors.reduce((acc, cur, i) => {
    if (cur) {
      return [
        ...acc,
        <Message kind="error" key={i} data-testid="proposal-details-error">
          {cur}
        </Message>,
      ];
    }
    return acc;
  }, []);
}

function sortAuthorUpdatesKeysByTimestamp(authorUpdates) {
  const getRootAuthorUpdate = (updateThread) =>
    Object.values(updateThread).find((c) => c.parentid === 0);
  return Object.keys(authorUpdates).sort(
    (a, b) =>
      getRootAuthorUpdate(authorUpdates[b]).timestamp -
      getRootAuthorUpdate(authorUpdates[a]).timestamp
  );
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

  const { main, ...authorUpdates } = keyCommentsThreadsBy(comments, (root) =>
    root.extradatahint === "proposalupdate"
      ? JSON.parse(root.extradata).title
      : "main"
  );

  const orderedAuthorUpdatesKeys =
    sortAuthorUpdatesKeysByTimestamp(authorUpdates);

  return (
    <SingleContentPage className={styles.detailsWrapper}>
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
            {orderedAuthorUpdatesKeys.map((update, i) => (
              <Comments
                comments={authorUpdates[update]}
                title={update}
                key={update}
                id={`author-update-${i + 1}`}
              />
            ))}
            {main && (
              <Comments
                comments={main}
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
