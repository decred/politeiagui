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
import { or } from "src/lib/fp";
import { PROPOSAL_STATE_VETTED } from "src/constants";

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

export function useComments(recordToken, proposalState) {
  const { enableCommentVote, recordType, constants } = useConfig();

  const errorSelector = or(
    sel.apiProposalCommentsError,
    sel.apiInvoiceCommentsError,
    sel.apiDccCommentsError,
    sel.apiLikeCommentsError,
    sel.apiCommentsLikesError
  );
  const error = useSelector(errorSelector);
  const commentsSelector = useMemo(
    () => sel.makeGetRecordComments(recordToken),
    [recordToken]
  );
  const commentsLikesSelector = useMemo(
    () => sel.makeGetRecordCommentsLikes(recordToken),
    [recordToken]
  );
  const lastVisitTimestampSelector = useMemo(
    () => sel.makeGetLastAccessTime(recordToken),
    [recordToken]
  );
  const comments = useSelector(commentsSelector);
  const commentsLikes = useSelector(commentsLikesSelector);
  const lastVisitTimestamp = useSelector(lastVisitTimestampSelector);
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
  const onFetchLikes = useAction(act.onFetchLikedComments);
  const onCommentVoteAction = useAction(act.onCommentVote);
  const onCensorComment = useAction(act.onCensorComment);

  const { currentUser } = useLoaderContext();
  const userid = currentUser && currentUser.userid;
  const email = currentUser && currentUser.email;

  const userLoggedIn = !!email;

  // comments are not public on cms. User needs to be logged in
  const isProposal = recordType === constants.RECORD_TYPE_PROPOSAL;
  const needsToFetchComments = isProposal
    ? !!recordToken && !comments
    : !!recordToken && !comments && userLoggedIn;

  const needsToFetchCommentsLikes =
    !!recordToken &&
    !commentsLikes &&
    enableCommentVote &&
    userLoggedIn &&
    proposalState === PROPOSAL_STATE_VETTED;

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
        onFetchLikes(recordToken, userid);
      }
    },
    [onFetchLikes, needsToFetchCommentsLikes, recordToken, userid]
  );

  const onCommentVote = useCallback(
    (commentID, action, token) => {
      onCommentVoteAction(userid, token, commentID, action, proposalState);
    },
    [onCommentVoteAction, userid, proposalState]
  );

  const getCommentLikeOption = useCallback(
    (commentID) => {
      const actionData = (commentsLikes || []).find(
        (cl) => cl.commentid === commentID
      );
      if (actionData) {
        return actionData.vote;
      }
      return actionData ? actionData.vote : 0;
    },
    [commentsLikes]
  );

  return {
    comments,
    onCommentVote,
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
    onSubmitComment,
    error
  };
}
