import React from "react";
import { Message } from "pi-ui";
import {
  SingleContentPage,
  useScrollTo,
  useScrollToTop,
} from "@politeiagui/common-ui/layout";
import { Comments } from "@politeiagui/comments/ui";
import { ProposalDetails, ProposalLoader } from "../../components";
import styles from "./styles.module.css";
import useProposalDetails from "./useProposalDetails";
import { getURLSearchParams } from "../../utils/getURLSearchParams";
import { GoBackLink } from "@politeiagui/common-ui";
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

function Details({ token, commentid = 0 }) {
  const {
    comments,
    detailsStatus,
    fullToken,
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
  const shouldScrollToComments = !!params?.scrollToComments || !!commentid;
  const detailsLoadedSucessfully =
    fullToken &&
    record &&
    detailsStatus === "succeeded" &&
    record.detailsFetched;

  useScrollToTop(shouldScrollToComments);
  useScrollTo(
    "proposal-comments",
    shouldScrollToComments && detailsLoadedSucessfully
  );

  const { mainCommentsThread, ...authorUpdates } = keyCommentsThreadsBy(
    comments,
    (root) =>
      root.extradatahint === "proposalupdate"
        ? JSON.parse(root.extradata).title
        : "mainCommentsThread"
  );

  const orderedAuthorUpdatesKeys =
    sortAuthorUpdatesKeysByTimestamp(authorUpdates);

  return (
    <SingleContentPage className={styles.detailsWrapper}>
      <GoBackLink
        className={styles.goBackLink}
        data-testid="proposal-go-back"
      />
      {detailsStatus === "loading" && <ProposalLoader isDetails />}
      {detailsStatus === "failed" && (
        <ErrorsMessages
          errors={[recordDetailsError, voteSummaryError, commentsError]}
        />
      )}
      {detailsLoadedSucessfully && (
        <>
          <ProposalDetails
            record={record}
            rfpRecord={rfpLinkedRecord}
            voteSummary={voteSummary}
            proposalSummary={proposalSummary}
            proposalStatusChanges={proposalStatusChanges}
            rfpSubmissionsRecords={rfpSubmissionsRecords}
            rfpSubmissionsCommentsCounts={rfpSubmissionsCommentsCounts}
            rfpSubmissionsProposalSummaries={rfpSubmissionsProposalsSummaries}
            rfpSubmissionsVoteSummaries={rfpSumbissionsVoteSummaries}
            hideBody={!!commentid}
          />
          <span id="proposal-comments" />
          {orderedAuthorUpdatesKeys.map((update, i) => (
            <Comments
              comments={authorUpdates[update]}
              parentId={+commentid}
              title={update}
              key={i}
              recordOwner={record.username}
              fullThreadUrl={`/record/${token}`}
            />
          ))}
          {mainCommentsThread && (
            <Comments
              parentId={+commentid}
              comments={mainCommentsThread}
              recordOwner={record.username}
              fullThreadUrl={`/record/${token}`}
              // Mocking onReply until user layer is done.
              onReply={(comment, parentid) => {
                console.log(`Replying ${parentid}:`, comment);
              }}
            />
          )}
        </>
      )}
    </SingleContentPage>
  );
}

export default Details;
