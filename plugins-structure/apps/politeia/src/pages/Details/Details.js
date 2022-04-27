import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Message } from "pi-ui";
import { recordsTimestamps } from "@politeiagui/core/records/timestamps";
import { SingleContentPage } from "@politeiagui/common-ui/layout";
import { Comments } from "@politeiagui/comments/ui";
import { ProposalDetails, ProposalLoader } from "../../components";
import {
  fetchProposalDetails,
  fetchProposalVersion,
  selectComments,
  selectDetailsError,
  selectDetailsStatus,
  selectPiSummary,
  selectRecord,
  selectVoteSummary,
} from "./detailsSlice";
import styles from "./styles.module.css";

function Details({ token }) {
  const dispatch = useDispatch();
  const record = useSelector(selectRecord);
  const voteSummary = useSelector(selectVoteSummary);
  const recordComments = useSelector(selectComments);
  const detailsStatus = useSelector(selectDetailsStatus);
  const detailsError = useSelector(selectDetailsError);
  const piSummary = useSelector(selectPiSummary);

  async function onFetchRecordTimestamps({ token, version }) {
    const res = await dispatch(recordsTimestamps.fetch({ token, version }));
    return res.payload;
  }
  async function onFetchPreviousVersions(version) {
    const res = await dispatch(fetchProposalVersion({ token, version }));
    return res.payload;
  }

  useEffect(() => {
    dispatch(fetchProposalDetails(token));
  }, [token, dispatch]);

  return (
    <SingleContentPage className={styles.detailsWrapper}>
      {detailsStatus === "loading" && <ProposalLoader isDetails />}
      {detailsStatus === "failed" && (
        <Message kind="error">{detailsError}</Message>
      )}
      {detailsStatus === "succeeded" && (
        <>
          <ProposalDetails
            record={record}
            voteSummary={voteSummary}
            piSummary={piSummary}
            onFetchVersion={onFetchPreviousVersions}
            onFetchRecordTimestamps={onFetchRecordTimestamps}
          />
          <Comments comments={recordComments} />
        </>
      )}
    </SingleContentPage>
  );
}

export default Details;
