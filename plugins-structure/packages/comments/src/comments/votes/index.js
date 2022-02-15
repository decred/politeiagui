import {
  fetchCommentsVotes,
  selectCommentsVotesError,
  selectCommentsVotesStatus,
  selectUserCommentsVotesByToken,
} from "./votesSlice";
import { useCommentsVotes } from "./useVotes";

export const commentsVotes = {
  fetch: fetchCommentsVotes,
  selectUserVotesByToken: selectUserCommentsVotesByToken,
  selectError: selectCommentsVotesError,
  selectStatus: selectCommentsVotesStatus,
  useFetch: useCommentsVotes,
};
