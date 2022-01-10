import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commentsVotes } from "./";
import { checkReducersDeps } from "../helpers";

export function useCommentsVotes({ token, userId, initialFetch = false }) {
  const dispatch = useDispatch();
  checkReducersDeps(["commentsVotes"]);

  // Selectors
  const votes = useSelector((state) =>
    commentsVotes.selectUserVotesByToken(state, { token, userid: userId })
  );
  const votesStatus = useSelector((state) => commentsVotes.selectStatus(state));
  const votesError = useSelector((state) => commentsVotes.selectError(state));

  // Actions
  const onFetchVotes = useCallback(
    () => dispatch(commentsVotes.fetch({ token, userid: userId })),
    [token, dispatch, userId]
  );

  // Effects
  useEffect(() => {
    if (votesStatus === "idle" && initialFetch) {
      onFetchVotes();
    }
  }, [votesStatus, onFetchVotes, initialFetch]);

  return {
    votes,
    votesError,
    votesStatus,
    onFetchVotes,
  };
}
