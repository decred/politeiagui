import { useEffect, useCallback, useMemo } from "react";
import { useConfig } from "src/containers/Config";
import { or } from "src/lib/fp";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import { useLoaderContext } from "src/containers/Loader";
import { PROPOSAL_STATE_VETTED } from "src/constants";
import ModalLogin from "src/components/ModalLogin";
import useModalContext from "src/hooks/utils/useModalContext";

export default function useComments(
  recordToken,
  proposalState,
  sectionId,
  threadParentID,
  isCurrentUserProposalAuthor
) {
  const isSingleThread = !!threadParentID;
  const { enableCommentVote, recordType, constants } = useConfig();
  const [handleOpenModal, handleCloseModal] = useModalContext();

  const errorSelector = or(
    sel.apiProposalCommentsError,
    sel.apiInvoiceCommentsError,
    sel.apiDccCommentsError,
    sel.apiLikeCommentsError,
    sel.apiCommentsLikesError
  );
  const error = useSelector(errorSelector);
  const allCommentsBySectionSelector = useMemo(
    () => sel.makeGetRecordComments(recordToken),
    [recordToken]
  );
  const sectionCommentsSelector = useMemo(
    () => sel.makeGetRecordSectionComments(recordToken, sectionId),
    [recordToken, sectionId]
  );
  const sectionIdsSelector = useMemo(
    () => sel.makeGetRecordCommentSectionIds(recordToken),
    [recordToken]
  );
  const commentsLikesSelector = useMemo(
    () => sel.makeGetRecordCommentsLikes(recordToken),
    [recordToken]
  );
  const commentsVotesSelector = useMemo(
    () => sel.makeGetRecordCommentsVotes(recordToken),
    [recordToken]
  );
  const lastVisitTimestampSelector = useMemo(
    () => sel.makeGetLastAccessTime(recordToken),
    [recordToken]
  );
  const comments = useSelector(sectionCommentsSelector);
  const allCommentsBySection = useSelector(allCommentsBySectionSelector);
  const commentSectionIds = useSelector(sectionIdsSelector);
  const hasAuthorUpdates = commentSectionIds && commentSectionIds.length > 1;
  const commentsLikes = useSelector(commentsLikesSelector);
  const commentsVotes = useSelector(commentsVotesSelector);
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
  const isCurrentUserAdmin = currentUser && currentUser.isadmin;

  const userLoggedIn = !!email;

  // comments are not public on cms. User needs to be logged in
  const isProposal = recordType === constants.RECORD_TYPE_PROPOSAL;
  const hasRecordToken = !!recordToken;
  const hasCommentsLeft = !allCommentsBySection;
  const isRecordMissingComments = hasRecordToken && hasCommentsLeft;
  const isVettedProposal = proposalState === PROPOSAL_STATE_VETTED;
  const canUserViewComments =
    isVettedProposal || isCurrentUserAdmin || isCurrentUserProposalAuthor;
  const needsToFetchComments = isProposal
    ? isRecordMissingComments && canUserViewComments
    : isRecordMissingComments && userLoggedIn;

  const needsToFetchCommentsLikes =
    !!recordToken &&
    !commentsLikes &&
    enableCommentVote &&
    userLoggedIn &&
    !loadingLikes &&
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

  const openLoginModal = useCallback(() => {
    handleOpenModal(ModalLogin, {
      onLoggedIn: handleCloseModal,
      onClose: handleCloseModal,
      title: "Your session has expired. Please log in again"
    });
  }, [handleOpenModal, handleCloseModal]);

  const onCommentVote = useCallback(
    (commentID, action, token) => {
      onCommentVoteAction(
        userid,
        token,
        commentID,
        action,
        proposalState,
        sectionId
      ).catch((e) => {
        if (e.statusCode === 403) {
          openLoginModal();
        }
      });
    },
    [onCommentVoteAction, userid, proposalState, sectionId, openLoginModal]
  );

  const getCommentLikeOption = useCallback(
    (commentID) => {
      const option = commentsLikes && commentsLikes[commentID];
      return option ? option : 0;
    },
    [commentsLikes]
  );

  const getCommentVotes = useCallback(
    (commentID) => commentsVotes && commentsVotes[commentID],
    [commentsVotes]
  );

  // If displaying a single thread while having multiple author updates with
  // different section, find to which tree the sub-tree we are displaying
  // belongs to display only the relevant section.
  let singleThreadRootId;
  if (isSingleThread && hasAuthorUpdates) {
    for (const [sectionId, comments] of Object.entries(allCommentsBySection)) {
      if (
        comments.map(({ commentid }) => commentid).includes(+threadParentID)
      ) {
        singleThreadRootId = sectionId;
      }
    }
  }

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
    loading: loading,
    loadingLikes,
    onSubmitComment,
    error,
    getCommentVotes,
    commentSectionIds,
    hasAuthorUpdates,
    finishedCommentsFetch: !hasCommentsLeft,
    latestAuthorUpdateId: hasAuthorUpdates && commentSectionIds[0],
    singleThreadRootId
  };
}
