import {
  fetchCommentsVotes,
  selectUserCommentsVotesByToken,
  selectCommentsVotesError,
  selectCommentsVotesStatus,
} from "./votesSlice";

export const commentsVotes = {
  fetch: fetchCommentsVotes,
  selectUserVotesByToken: selectUserCommentsVotesByToken,
  selectError: selectCommentsVotesError,
  selectStatus: selectCommentsVotesStatus,
};
