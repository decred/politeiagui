import { useCallback, useEffect } from "react";
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

  // Actions
  const onFetchVotes = useCallback(
    () => dispatch(commentsVotes.fetch({ token, userid: userId })),
    [token, dispatch, userId]
  );

  // Effects
  useEffect(() => {
    if (votesStatus === "idle") {
      onFetchVotes();
    }
  }, [votesStatus, onFetchVotes]);

  return {
    votes,
    votesError,
    votesStatus,
    onFetchVotes,
  };
}
