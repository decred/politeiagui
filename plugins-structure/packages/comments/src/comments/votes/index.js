import {
  fetchCommentsVotes,
  selectUserCommentsVotesByToken,
  selectCommentsVotesError,
  selectCommentsVotesStatus,
} from "./votesSlice";
import { useCommentsVotes } from "./useVotes";

export const commentsVotes = {
  fetch: fetchCommentsVotes,
  selectUserVotesByToken: selectUserCommentsVotesByToken,
  selectError: selectCommentsVotesError,
  selectStatus: selectCommentsVotesStatus,
  useFetch: useCommentsVotes,
};
