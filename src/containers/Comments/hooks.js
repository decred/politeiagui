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
  onCensorComment: act.onCensorCommentv2
};

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
  const mapStateToProps = useMemo(
    () => ({
      comments: commentsSelector,
      commentsLikes: commentsLikesSelector,
      lastVisitTimestamp: sel.visitedProposal,
      loading: sel.isApiRequestingComments,
      loadingLikes: sel.isApiRequestingCommentsLikes
    }),
    [commentsSelector, commentsLikesSelector]
  );

  const {
    comments,
    onFetchComments,
    onFetchLikes,
    onCensorComment,
    onLikeComment: onLikeCommentAction,
    commentsLikes,
    ...fromRedux
  } = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
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
