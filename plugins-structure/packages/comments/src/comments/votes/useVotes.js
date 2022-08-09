import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentsVotes } from "./";

export function useCommentsVotes({ token, userId }) {
  const dispatch = useDispatch();

  // Selectors
  const votes = useSelector((state) =>
    commentsVotes.selectUserVotesByToken(state, { token, userid: userId })
  );
  const votesStatus = useSelector((state) => commentsVotes.selectStatus(state));
  const votesError = useSelector((state) => commentsVotes.selectError(state));

  // Effects
  useEffect(() => {
    if (votesStatus === "idle") {
      dispatch(commentsVotes.fetch({ token, userid: userId }));
    }
  }, [votesStatus, token, userId, dispatch]);

  return {
    votes,
    votesError,
    votesStatus,
  };
}
