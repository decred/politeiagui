import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recordsTimestamps } from "@politeiagui/core/records/timestamps";
import { fetchProposalDetails } from "./actions";
import { selectDetailsStatus } from "./selectors";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { ticketvoteSubmissions } from "@politeiagui/ticketvote/submissions";
import { ticketvoteTimestamps } from "@politeiagui/ticketvote/timestamps";
import { ticketvoteGetVotesReceived } from "@politeiagui/ticketvote/helpers";
import { recordComments } from "@politeiagui/comments/comments";
import { commentsCount } from "@politeiagui/comments/count";
import { getRfpRecordLink } from "../../pi/proposals/utils";
import { piSummaries, proposals } from "../../pi";
import { downloadJSON } from "@politeiagui/core/downloads";
import { commentsTimestamps } from "@politeiagui/comments/timestamps";

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

  const recordDetailsError = useSelector(records.selectError);
  const voteSummaryError = useSelector(ticketvoteSummaries.selectError);
  const commentsError = useSelector(recordComments.selectError);

  const proposalStatusChanges = useSelector((state) =>
    proposals.selectStatusChangesByToken(state, fullToken)
  );

  // RFP Submissions
  const rfpSubmissionsTokens = useSelector((state) =>
    ticketvoteSubmissions.selectByToken(state, fullToken)
  );
  const rfpSubmissionsRecords = useSelector((state) =>
    records.selectByTokensBatch(state, rfpSubmissionsTokens)
  );
  const rfpSumbissionsVoteSummaries = useSelector((state) =>
    ticketvoteSummaries.selectByTokensBatch(state, rfpSubmissionsTokens)
  );
  const rfpSubmissionsCommentsCounts = useSelector((state) =>
    commentsCount.selectByTokensBatch(state, rfpSubmissionsTokens)
  );
  const rfpSubmissionsProposalsSummaries = useSelector((state) =>
    piSummaries.selectByTokensBatch(state, rfpSubmissionsTokens)
  );

  // RFP Linked Proposal
  const rfpLinkedRecordToken = getRfpRecordLink(record);
  const rfpLinkedRecord = useSelector((state) =>
    records.selectByToken(state, rfpLinkedRecordToken)
  );

  // Timestamps actions
  function onFetchRecordTimestamps(version) {
    dispatch(recordsTimestamps.fetch({ token, version }));
  }

  function onFetchCommentsTimestamps() {
    // TODO: Support timestamps for separate threads and comments sections
    const ids = Object.keys(comments).map((id) => +id);
    dispatch(
      commentsTimestamps.fetchAll({ token: fullToken, commentids: ids })
    );
  }

  function onFetchVotesTimestamps() {
    const votesCount = ticketvoteGetVotesReceived(voteSummary);
    dispatch(ticketvoteTimestamps.fetchAll({ token: fullToken, votesCount }));
  }

  function onDownloadCommentsBundle() {
    const commentsToDownload = comments && Object.values(comments);
    downloadJSON(commentsToDownload, `${token}-comments-bundle`);
  }

  function onDownloadVotesBundle() {
    console.log("fetching results and detais before download...");
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
    onFetchCommentsTimestamps,
    onFetchVotesTimestamps,
    onDownloadCommentsBundle,
    onDownloadVotesBundle,
    proposalSummary,
    record,
    voteSummary,
    proposalStatusChanges,
    rfpLinkedRecord,
    rfpSubmissionsRecords,
    rfpSubmissionsCommentsCounts,
    rfpSubmissionsProposalsSummaries,
    rfpSumbissionsVoteSummaries,
  };
}

export default useProposalDetails;
