import * as act from "src/actions";
import { useAction } from "src/redux";

export default function useTimestamps() {
  const onFetchRecordTimestamps = useAction(act.onFetchRecordTimestamps);
  const onFetchCommentsTimestamps = useAction(act.onFetchCommentsTimestamps);
  const onFetchTicketVoteTimestamps = useAction(
    act.onFetchTicketVoteTimestamps
  );
  const onFetchVotesBundle = useAction(act.onFetchVotesBundle);
  return {
    onFetchRecordTimestamps,
    onFetchCommentsTimestamps,
    onFetchTicketVoteTimestamps,
    onFetchVotesBundle
  };
}
