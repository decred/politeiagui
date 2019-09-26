import {
  useEffect,
  useCallback,
  createContext,
  useContext,
  useMemo
} from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import { useConfig } from "src/Config";
import { useLoaderContext } from "src/Appv2/Loader";

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

const mapDispatchToProps = {
  onSubmitComment: act.onSaveNewCommentV2,
  onFetchComments: act.onFetchProposalComments,
  onFetchLikes: act.onFetchLikedComments,
  onLikeComment: act.onLikeComment,
  onResetComments: act.onResetComments,
  onCensorComment: act.onCensorCommentv2,
  onResetCommentsLikes: act.onResetLikedComments
};

export function useComments(ownProps) {
  const recordToken = ownProps && ownProps.recordToken;
  const commentsSelector = useMemo(
    () => sel.makeGetProposalComments(recordToken),
    [recordToken]
  );
  const mapStateToProps = useMemo(
    () => ({
      comments: commentsSelector,
      commentsLikes: sel.commentsLikes,
      lastVisitTimestamp: sel.visitedProposal,
      loading: sel.isApiRequestingComments,
      loadingLikes: sel.isApiRequestingCommentsLikes
    }),
    [commentsSelector]
  );

  const {
    comments,
    onFetchComments,
    onFetchLikes,
    onCensorComment,
    onLikeComment: onLikeCommentAction,
    commentsLikes,
    onResetCommentsLikes,
    ...fromRedux
  } = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  const { enableCommentVote, recordType } = useConfig();
  const { currentUser } = useLoaderContext();
  const email = currentUser && currentUser.email;

  const userLoggedIn = !!email;

  const numOfComments = (ownProps && ownProps.numOfComments) || 0;
  const needsToFetchData = !!recordToken && !comments && numOfComments > 0;

  useEffect(
    function handleFetchOfComments() {
      if (needsToFetchData) {
        onFetchComments(recordToken);
      }
    },
    [onFetchComments, needsToFetchData, recordToken]
  );

  useEffect(
    function handleFetchOfLikes() {
      if (
        !!recordToken &&
        numOfComments > 0 &&
        enableCommentVote &&
        userLoggedIn
      ) {
        onFetchLikes(recordToken);
      }

      return () => onResetCommentsLikes();
    },
    [
      onFetchLikes,
      onResetCommentsLikes,
      enableCommentVote,
      needsToFetchData,
      userLoggedIn,
      recordToken
    ]
  );

  const onLikeComment = useCallback(
    (commentID, action) => {
      onLikeCommentAction(email, recordToken, commentID, action);
    },
    [recordToken, email, onLikeCommentAction]
  );

  const getCommentLikeOption = useCallback(
    commentID => {
      const actionData = (commentsLikes || []).find(
        cl => cl.commentid === commentID
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
    ...fromRedux
  };
}
