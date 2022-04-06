import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProposalDetails,
  selectComments,
  selectDetailsError,
  selectDetailsStatus,
  selectPiSummary,
  selectRecord,
  selectVoteSummary,
} from "./detailsSlice";
import { Comments } from "@politeiagui/comments/ui";
import ProposalDetails from "../../components/Proposal/ProposalDetails";
import { Message } from "pi-ui";
import { recordsTimestamps } from "@politeiagui/core/records/timestamps";

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

  useEffect(() => {
    dispatch(fetchProposalDetails(token));
  }, [token, dispatch]);

  return detailsStatus === "succeeded" ? (
    <div>
      <ProposalDetails
        record={record}
        voteSummary={voteSummary}
        piSummary={piSummary}
        onFetchRecordTimestamps={onFetchRecordTimestamps}
      />
      <Comments comments={recordComments} />
    </div>
  ) : detailsStatus === "failed" ? (
    <Message kind="error">{detailsError}</Message>
  ) : (
    "Loading..."
  );
}

export default Details;
