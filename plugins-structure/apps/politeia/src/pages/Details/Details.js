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

function Details({ token }) {
  const {
    comments,
    detailsError,
    detailsStatus,
    fullToken,
    onFetchPreviousVersions,
    onFetchRecordTimestamps,
    piSummary,
    record,
    voteSummary,
  } = useProposalDetails({ token });
  const params = getURLSearchParams();
  const shouldScrollToComments = !!params?.scrollToComments;
  useScrollToTop(shouldScrollToComments);
  return (
    <SingleContentPage className={styles.detailsWrapper}>
      {detailsStatus === "loading" && <ProposalLoader isDetails />}
      {detailsStatus === "failed" && (
        <Message kind="error">{detailsError}</Message>
      )}
      {fullToken && detailsStatus === "succeeded" && (
        <>
          <ProposalDetails
            record={record}
            voteSummary={voteSummary}
            piSummary={piSummary}
            onFetchVersion={onFetchPreviousVersions}
            onFetchRecordTimestamps={onFetchRecordTimestamps}
          />
          <Comments comments={comments} scrollOnLoad={shouldScrollToComments} />
        </>
      )}
    </SingleContentPage>
  );
}

export default Details;
