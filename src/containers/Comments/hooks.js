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
import { useConfig } from "src/containers/Config";
import { useLoaderContext } from "src/containers/Loader";

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

export function useComments(recordToken) {
  const { enableCommentVote, recordType, constants } = useConfig();
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
  const onSubmitComment = useAction(
    recordType === constants.RECORD_TYPE_DCC
      ? act.onSaveNewDccComment
      : act.onSaveNewComment
  );
  const onFetchComments = useAction(
    recordType === constants.RECORD_TYPE_PROPOSAL
      ? act.onFetchProposalComments
      : recordType === constants.RECORD_TYPE_DCC
      ? act.onFetchDccComments
      : act.onFetchInvoiceComments
  );
  const loadingLikeAction = useSelector(sel.isApiRequestingLikeComment);
  const onFetchLikes = useAction(act.onFetchLikedComments);
  const onLikeCommentAction = useAction(act.onLikeComment);
  const onResetComments = useAction(act.onResetComments);
  const onCensorComment = useAction(act.onCensorComment);

  const { currentUser } = useLoaderContext();
  const email = currentUser && currentUser.email;

  const userLoggedIn = !!email;

  // comments are not public on cms. User needs to be logged in
  const isPublic = recordType === constants.RECORD_TYPE_PROPOSAL;
  const needsToFetchComments = isPublic
    ? !!recordToken && !comments
    : !!recordToken && !comments && userLoggedIn;

  const needsToFetchCommentsLikes =
    !!recordToken && !commentsLikes && enableCommentVote && userLoggedIn;

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
