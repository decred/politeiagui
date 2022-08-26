import {
  fetchCommentsVotes,
  selectCommentsVotesError,
  selectCommentsVotesStatus,
  selectUserCommentsVotesByToken,
} from "./votesSlice";

export const commentsVotes = {
  fetch: fetchCommentsVotes,
  selectUserVotesByToken: selectUserCommentsVotesByToken,
  selectError: selectCommentsVotesError,
  selectStatus: selectCommentsVotesStatus,
};
