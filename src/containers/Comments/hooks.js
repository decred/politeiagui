import {
  useEffect,
  useCallback,
  createContext,
  useContext,
  useMemo
} from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import { useConfig } from "src/Config";
import { useLoaderContext } from "src/Appv2/Loader";

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

export function useComments(ownProps) {
  const recordToken = ownProps && ownProps.recordToken;
  const commentsSelector = useMemo(
    () => sel.makeGetProposalComments(recordToken),
    [recordToken]
  );
  const commentsLikesSelector = useMemo(
    () => sel.makeGetProposalCommentsLikes(recordToken),
    [recordToken]
  );

  const comments = useSelector(commentsSelector);
  const commentsLikes = useSelector(commentsLikesSelector);
  const lastVisitTimestamp = useSelector(sel.visitedProposal);
  const loading = useSelector(sel.isApiRequestingComments);
  const loadingLikes = useSelector(sel.isApiRequestingCommentsLikes);
  const loadingLikeAction = useSelector(sel.isApiRequestingLikeComment);
  const onSubmitComment = useAction(act.onSaveNewCommentV2);
  const onFetchComments = useAction(act.onFetchProposalComments);
  const onFetchLikes = useAction(act.onFetchLikedComments);
  const onLikeCommentAction = useAction(act.onLikeComment);
  const onResetComments = useAction(act.onResetComments);
  const onCensorComment = useAction(act.onCensorCommentv2);

  const { enableCommentVote, recordType } = useConfig();
  const { currentUser } = useLoaderContext();
  const email = currentUser && currentUser.email;

  const userLoggedIn = !!email;

  const numOfComments = (ownProps && ownProps.numOfComments) || 0;
  const needsToFetchComments = !!recordToken && !comments && numOfComments > 0;
  const needsToFetchCommentsLikes =
    !!recordToken &&
    !commentsLikes &&
    numOfComments > 0 &&
    enableCommentVote &&
    userLoggedIn;

  useEffect(
    function handleFetchOfComments() {
      if (needsToFetchComments) {
        onFetchComments(recordToken);
      }
    },
    [onFetchComments, needsToFetchComments, recordToken]
  );

  useEffect(
    function handleFetchOfLikes() {
      if (needsToFetchCommentsLikes) {
        onFetchLikes(recordToken);
      }
    },
    [onFetchLikes, needsToFetchCommentsLikes, recordToken]
  );

  const onLikeComment = useCallback(
    (commentID, action) => {
      onLikeCommentAction(email, recordToken, commentID, action);
    },
    [recordToken, email, onLikeCommentAction]
  );

  const getCommentLikeOption = useCallback(
    (commentID) => {
      const actionData = (commentsLikes || []).find(
        (cl) => cl.commentid === commentID
      );
      if (actionData) {
        return actionData.action;
      }
      return actionData ? actionData.action : 0;
    },
    [commentsLikes]
  );

  return {
    comments,
    onLikeComment,
    onCensorComment,
    getCommentLikeOption,
    enableCommentVote,
    userLoggedIn,
    userEmail: email,
    recordType,
    currentUser,
    lastVisitTimestamp,
    loading,
    loadingLikes,
    loadingLikeAction,
    onSubmitComment,
    onResetComments
  };
}
