import { useDispatch, useSelector } from "react-redux";
import { recordsTimestamps } from "@politeiagui/core/records/timestamps";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { ticketvoteTimestamps } from "@politeiagui/ticketvote/timestamps";
import { ticketvoteGetVotesReceived } from "@politeiagui/ticketvote/helpers";
import { recordComments } from "@politeiagui/comments/comments";
import { downloadJSON } from "@politeiagui/core/downloads";
import { commentsTimestamps } from "@politeiagui/comments/timestamps";

export function useProposalDownloads({ token }) {
  const dispatch = useDispatch();

  const record = useSelector((state) => records.selectByToken(state, token));
  const voteSummary = useSelector((state) =>
    ticketvoteSummaries.selectByToken(state, token)
  );
  const comments = useSelector((state) =>
    recordComments.selectByToken(state, token)
  );

  // Timestamps downloads
  async function onFetchRecordTimestamps(version) {
    const { payload } = await dispatch(
      recordsTimestamps.fetch({ token, version })
    );
    downloadJSON(payload, `${token}-v${version}-record-timestamps`);
  }

  async function onFetchCommentsTimestamps() {
    // TODO: Support timestamps for separate threads and comments sections
    const ids = Object.keys(comments).map((id) => +id);
    const { payload } = await dispatch(
      commentsTimestamps.fetchAll({ token, commentids: ids })
    );
    downloadJSON(payload, `${token}-comments-timestamps`);
  }

  async function onFetchVotesTimestamps() {
    const votesCount = ticketvoteGetVotesReceived(voteSummary);
    const { payload } = await dispatch(
      ticketvoteTimestamps.fetchAll({ token, votesCount })
    );
    downloadJSON(payload, `${token}-vote-timestamps`);
  }

  // Bundle download
  function onDownloadCommentsBundle() {
    const commentsToDownload = comments && Object.values(comments);
    downloadJSON(commentsToDownload, `${token}-comments-bundle`);
  }

  function onDownloadVotesBundle() {
    console.log("fetching results and detais before download...");
  }

  function onDownloadRecordBundle() {
    const { detailsFetched: _, ...recordToDownload } = record;
    downloadJSON(recordToDownload, `${token}-v${record.version}-record-bundle`);
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
