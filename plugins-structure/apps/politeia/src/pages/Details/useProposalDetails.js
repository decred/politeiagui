import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recordsTimestamps } from "@politeiagui/core/records/timestamps";
import { fetchProposalDetails } from "./actions";
import { selectDetailsStatus, selectRfpSubmissionsRecords } from "./selectors";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { recordComments } from "@politeiagui/comments/comments";
import { piBilling, piSummaries, proposals } from "../../pi";

function useProposalDetails({ token }) {
  const dispatch = useDispatch();
  const detailsStatus = useSelector(selectDetailsStatus);
  const fullToken = useSelector((state) =>
    records.selectFullToken(state, token)
  );
  const record = useSelector((state) =>
    records.selectByToken(state, fullToken)
  );
  const recordStatus = useSelector(records.selectStatus);
  const voteSummary = useSelector((state) =>
    ticketvoteSummaries.selectByToken(state, fullToken)
  );
  const comments = useSelector((state) =>
    recordComments.selectByToken(state, fullToken)
  );
  const proposalSummary = useSelector((state) =>
    piSummaries.selectByToken(state, fullToken)
  );
  const billingStatusChange = useSelector((state) =>
    piBilling.selectLastByToken(state, fullToken)
  );

  const recordDetailsError = useSelector(records.selectError);
  const voteSummaryError = useSelector(ticketvoteSummaries.selectError);
  const commentsError = useSelector(recordComments.selectError);

  const proposalStatusChanges = useSelector((state) =>
    proposals.selectStatusChangesByToken(state, fullToken)
  );

  // RFP Proposals
  const rfpSubmissionsRecords = useSelector((state) =>
    selectRfpSubmissionsRecords(state, fullToken)
  );

  async function onFetchRecordTimestamps({ token, version }) {
    const res = await dispatch(recordsTimestamps.fetch({ token, version }));
    return res.payload;
  }

  useEffect(() => {
    if (
      recordStatus !== "loading" &&
      recordStatus !== "failed" &&
      !record?.detailsFetched
    ) {
      dispatch(fetchProposalDetails(token));
    }
  }, [token, dispatch, recordStatus, record]);

  return {
    comments,
    recordDetailsError,
    voteSummaryError,
    commentsError,
    detailsStatus,
    fullToken,
    onFetchRecordTimestamps,
    proposalSummary,
    record,
    voteSummary,
    billingStatusChange,
    proposalStatusChanges,
    rfpSubmissionsRecords,
  };
}

export default useProposalDetails;
