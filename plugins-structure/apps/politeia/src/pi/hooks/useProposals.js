import { useSelector } from "react-redux";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { commentsCount } from "@politeiagui/comments/count";
import { piSummaries } from "../summaries";
import { proposals } from "../proposals";

function useProposals() {
  const countComments = useSelector(commentsCount.selectAll);
  const voteSummaries = useSelector(ticketvoteSummaries.selectAll);
  const proposalSummaries = useSelector(piSummaries.selectAll);
  const recordsFetched = useSelector(records.selectAll);
  const proposalsStatusChanges = useSelector(proposals.selectAllStatusChanges);

  return {
    records: recordsFetched,
    countComments,
    voteSummaries,
    proposalSummaries,
    proposalsStatusChanges,
  };
}

export default useProposals;
