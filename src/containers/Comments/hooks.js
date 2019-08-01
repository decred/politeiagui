import { useEffect, useCallback, createContext, useContext } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import { useConfig } from "src/Config";

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

const mapStateToProps = {
  email: sel.loggedInAsEmail,
  comments: sel.proposalComments,
  commentsLikes: sel.commentsLikes,
  loading: sel.isApiRequestingComments,
  loadingLikes: sel.isApiRequestingCommentsLikes
};

const mapDispatchToProps = {
  onSubmitComment: act.onSaveNewCommentV2,
  onFetchComments: act.onFetchProposalComments,
  onFetchLikes: act.onFetchLikedComments,
  onLikeComment: act.onLikeComment,
  onResetComments: act.onResetComments
};

export function useComments(ownProps) {
  const {
    onFetchComments,
    onLikeComment: onLikeCommentAction,
    email,
    onFetchLikes,
    commentsLikes,
    onResetComments,
    ...fromRedux
  } = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  const { enableCommentVote, recordType } = useConfig();

  const userLoggedIn = !!email;
  const recordToken = ownProps && ownProps.recordToken;
  const numOfComments = (ownProps && ownProps.numOfComments) || 0;
  const needsToFetchData = !!recordToken && numOfComments > 0;

  useEffect(
    function handleFetchOfComments() {
      if (recordToken && numOfComments > 0) {
        onFetchComments(recordToken);
      }
      return () => onResetComments();
    },
    [
      onFetchComments,
      onResetComments,
      needsToFetchData,
      recordToken,
      numOfComments
    ]
  );

  useEffect(
    function handleFetchOfLikes() {
      if (needsToFetchData && enableCommentVote && userLoggedIn) {
        onFetchLikes(recordToken);
      }
    },
    [
      onFetchLikes,
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
    onLikeComment,
    getCommentLikeOption,
    enableCommentVote,
    userLoggedIn,
    recordType,
    ...fromRedux
  };
}
