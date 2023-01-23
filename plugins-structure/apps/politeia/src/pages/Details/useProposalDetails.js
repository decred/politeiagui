import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectDetailsStatus } from "./selectors";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { ticketvoteSubmissions } from "@politeiagui/ticketvote/submissions";
import { recordComments } from "@politeiagui/comments/comments";
import { commentsCount } from "@politeiagui/comments/count";
import {
  decodeProposalMetadataFile,
  getRfpRecordLink,
} from "../../pi/proposals/utils";
import { piSummaries, proposals } from "../../pi";
import app from "../../app";

function useProposalDetails({ token }) {
  const detailsStatus = useSelector(selectDetailsStatus);
  const fullToken = useSelector((state) =>
    records.selectFullToken(state, token)
  );
  const record = useSelector((state) =>
    records.selectByToken(state, fullToken)
  );
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

  useEffect(() => {
    if (record?.files) {
      const { name } = decodeProposalMetadataFile(record.files);
      app.setDocumentTitle(name);
    }
  }, [record]);

  return {
    comments,
    recordDetailsError,
    voteSummaryError,
    commentsError,
    detailsStatus,
    fullToken,
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
