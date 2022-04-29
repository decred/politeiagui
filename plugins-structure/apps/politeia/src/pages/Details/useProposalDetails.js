import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recordsTimestamps } from "@politeiagui/core/records/timestamps";
import {
  fetchProposalDetails,
  fetchProposalVersion,
  selectComments,
  selectDetailsError,
  selectDetailsStatus,
  selectFullToken,
  selectPiSummary,
  selectRecord,
  selectVoteSummary,
} from "./detailsSlice";

function useProposalDetails({ token }) {
  const dispatch = useDispatch();
  const record = useSelector((state) => selectRecord(state, token));
  const voteSummary = useSelector((state) => selectVoteSummary(state, token));
  const recordComments = useSelector((state) => selectComments(state, token));
  const detailsStatus = useSelector((state) =>
    selectDetailsStatus(state, token)
  );
  const detailsError = useSelector(selectDetailsError);
  const piSummary = useSelector((state) => selectPiSummary(state, token));
  const fullToken = useSelector((state) => selectFullToken(state, token));

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

  return {
    comments: recordComments,
    detailsError,
    detailsStatus,
    fullToken,
    onFetchPreviousVersions,
    onFetchRecordTimestamps,
    piSummary,
    record,
    voteSummary,
  };
}

export default useProposalDetails;
