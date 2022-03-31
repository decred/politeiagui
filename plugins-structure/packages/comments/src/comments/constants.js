import comments from "./comments/commentsSlice";
import count from "./count/countSlice";
import policy from "./policy/policySlice";
import timestamps from "./timestamps/timestampsSlice";
import votes from "./votes/votesSlice";

export const reducersArray = [
  {
    key: "comments",
    reducer: comments,
  },
  {
    key: "commentsCount",
    reducer: count,
  },
  {
    key: "commentsPolicy",
    reducer: policy,
  },
  {
    key: "commentsTimestamps",
    reducer: timestamps,
  },
  {
    key: "commentsVotes",
    reducer: votes,
  },
];
