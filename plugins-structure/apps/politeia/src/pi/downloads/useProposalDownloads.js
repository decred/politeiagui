import { useDispatch, useSelector } from "react-redux";
import { recordsTimestamps } from "@politeiagui/core/records/timestamps";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { ticketvoteTimestamps } from "@politeiagui/ticketvote/timestamps";
import { ticketvoteGetVotesReceived } from "@politeiagui/ticketvote/helpers";
import { recordComments } from "@politeiagui/comments/comments";
import { downloadJSON } from "@politeiagui/core/downloads";
import { commentsTimestamps } from "@politeiagui/comments/timestamps";
import { ticketvoteResults } from "@politeiagui/ticketvote/results";
import { ticketvoteDetails } from "@politeiagui/ticketvote/details";

export function useProposalDownloads({ token, version }) {
  const dispatch = useDispatch();

  const record = useSelector((state) =>
    records.selectVersionByToken(state, { token, version })
  );
  const voteSummary = useSelector((state) =>
    ticketvoteSummaries.selectByToken(state, token)
  );
  const comments = useSelector((state) =>
    recordComments.selectByToken(state, token)
  );

  // Timestamps downloads
  async function onFetchRecordTimestamps() {
    const { payload } = await dispatch(
      recordsTimestamps.fetch({ token, version })
    );
    downloadJSON(payload, `${token}-v${version}-record-timestamps`);
  }

  async function onFetchCommentsTimestamps() {
    // TODO: Support timestamps for separate threads and comments sections
    const ids = Object.keys(comments).map((id) => +id);
    const { payload, error } = await dispatch(
      commentsTimestamps.fetchAll({ token, commentids: ids })
    );
    if (!error) downloadJSON(payload, `${token}-comments-timestamps`);
  }

  async function onFetchVotesTimestamps() {
    const votesCount = ticketvoteGetVotesReceived(voteSummary);
    const { payload, error } = await dispatch(
      ticketvoteTimestamps.fetchAll({ token, votesCount })
    );
    if (!error) downloadJSON(payload, `${token}-votes-timestamps`);
  }

  // Bundle download
  function onDownloadCommentsBundle() {
    const commentsToDownload = comments && Object.values(comments);
    downloadJSON(commentsToDownload, `${token}-comments-bundle`);
  }

  async function onDownloadVotesBundle() {
    const responses = await Promise.all([
      dispatch(ticketvoteResults.fetch({ token })),
      dispatch(ticketvoteDetails.fetch({ token })),
    ]);
    const bundleToDownload = responses
      .map((r) => r.payload)
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
    downloadJSON(bundleToDownload, `${token}-votes-bundle`);
  }

  function onDownloadRecordBundle() {
    const { detailsFetched: _, ...recordToDownload } = record;
    downloadJSON(recordToDownload, `${token}-v${version}-record-bundle`);
  }

  return {
    onFetchCommentsTimestamps,
    onFetchRecordTimestamps,
    onFetchVotesTimestamps,
    onDownloadCommentsBundle,
    onDownloadRecordBundle,
    onDownloadVotesBundle,
  };
}
