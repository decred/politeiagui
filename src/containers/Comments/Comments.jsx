import React, {
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useState
} from "react";
import { Card, H2, Text, Message, classNames, Toggle, P, Select } from "pi-ui";
import { withRouter } from "react-router-dom";
import styles from "./Comments.module.css";
import LoggedInContent from "src/components/LoggedInContent";
import CommentForm from "src/components/CommentForm/CommentFormLazy";
import ModalConfirmWithReason from "src/components/ModalConfirmWithReason";
import { useComments, CommentContext } from "./hooks";
import CommentsListWrapper from "./CommentsList/CommentsListWrapper";
import CommentLoader from "./Comment/CommentLoader";
import Link from "src/components/Link";
import Or from "src/components/Or";
import useQueryString from "src/hooks/utils/useQueryString";
import useScrollTo from "src/hooks/utils/useScrollTo";
import {
  getSortOptionsForSelect,
  createSelectOptionFromSortOption,
  commentSortOptions,
  handleCommentCensoringInfo,
  NUMBER_OF_LIST_PLACEHOLDERS
} from "./helpers";
import useIdentity from "src/hooks/api/useIdentity";
import usePaywall from "src/hooks/api/usePaywall";
import { IdentityMessageError } from "src/components/IdentityErrorIndicators";
import ModalLogin from "src/components/ModalLogin";
import useModalContext from "src/hooks/utils/useModalContext";
import WhatAreYourThoughts from "src/components/WhatAreYourThoughts";
import { commentsReducer, initialState, actions } from "./commentsReducer";
import { getQueryStringValue } from "src/lib/queryString";
import useLocalStorage from "src/hooks/utils/useLocalStorage";

const COMMENTS_LOGIN_MODAL_ID = "commentsLoginModal";

const Comments = ({
  numOfComments,
  recordToken,
  recordTokenFull,
  recordAuthorID,
  recordAuthorUsername,
  threadParentID,
  readOnly,
  readOnlyReason,
  className,
  history,
  proposalState,
  recordBaseLink
}) => {
  const [, identityError] = useIdentity();
  const { isPaid, paywallEnabled } = usePaywall();
  const [state, dispatch] = useReducer(commentsReducer, initialState);
  const [isFlatCommentsMode, setIsFlatCommentsMode] = useState(false);
  const [flatModeOnLocalStorage, setflatModeOnLocalStorage] = useLocalStorage(
    "flatComments",
    false
  );
  useEffect(() => {
    if (flatModeOnLocalStorage && !isFlatCommentsMode && !threadParentID) {
      setIsFlatCommentsMode(true);
    }
  }, [flatModeOnLocalStorage, isFlatCommentsMode, threadParentID]);
  const [sortOption, setSortOption] = useQueryString(
    "sort",
    commentSortOptions.SORT_BY_TOP
  );

  const {
    onSubmitComment,
    onCommentVote,
    onCensorComment,
    comments,
    loading,
    recordType,
    lastVisitTimestamp,
    currentUser,
    error,
    ...commentsCtx
  } = useComments(recordTokenFull, proposalState);

  const commentsCount = comments ? comments.length : 0;

  const [handleOpenModal, handleCloseModal] = useModalContext();
  const { userid } = currentUser || {};

  const onRedirectToSignup = () => {
    history.push("/user/signup");
  };

  const paywallMissing = paywallEnabled && !isPaid;
  const isSingleThread = !!threadParentID;

  const handleSubmitComment = useCallback(
    (comment) =>
      onSubmitComment({
        comment,
        token: recordTokenFull,
        parentID: 0,
        state: proposalState
      }),
    [onSubmitComment, proposalState, recordTokenFull]
  );

  const handleSetSortOption = useCallback(
    (option) => {
      setSortOption(option.value);
      dispatch({
        type: actions.SORT,
        sortOption: option.value
      });
    },
    [setSortOption]
  );

  const selectOptions = useMemo(() => getSortOptionsForSelect(), []);
  const selectValue = useMemo(
    () => createSelectOptionFromSortOption(sortOption),
    [sortOption]
  );

  const hasComments = !!comments;
  const hasScrollToQuery = !!getQueryStringValue("scrollToComments");
  const shouldScrollToComments =
    (hasScrollToQuery || isSingleThread) && hasComments;
  useScrollTo("commentArea", shouldScrollToComments);

  useEffect(
    function handleUpdateComments() {
      if (!!comments && !!comments.length) {
        dispatch({
          type: actions.UPDATE,
          comments,
          sortOption
        });
      }
    },
    [comments, sortOption]
  );

  const commentLoaders = useMemo(() => {
    if (!loading) return null;

    const numOfContents =
      numOfComments < 3 ? numOfComments : NUMBER_OF_LIST_PLACEHOLDERS;
    const contents = [];
    for (let i = 0; i < numOfContents; i++) {
      contents.push(<CommentLoader key={`comment-loader-${i}`} />);
    }
    return contents;
  }, [numOfComments, loading]);

  const handleOpenLoginModal = useCallback(() => {
    handleOpenModal(ModalLogin, {
      id: COMMENTS_LOGIN_MODAL_ID,
      onLoggedIn: handleCloseModal
    });
  }, [handleOpenModal, handleCloseModal]);

  const handleCensorCommentModal = useCallback(
    function handleCensorCommentModal(id) {
      const handleCensorComment = handleCommentCensoringInfo(
        onCensorComment,
        userid,
        recordTokenFull,
        id,
        proposalState
      );
      handleOpenModal(ModalConfirmWithReason, {
        title: "Censor comment",
        reasonLabel: "Censor reason",
        subject: "censorComment",
        successTitle: "Comment censored",
        successMessage: (
          <Text>The comment has been successfully censored.</Text>
        ),
        onSubmit: handleCensorComment,
        onClose: () => handleCloseModal()
      });
    },
    [
      onCensorComment,
      userid,
      recordTokenFull,
      proposalState,
      handleOpenModal,
      handleCloseModal
    ]
  );

  const handleCommentsModeToggle = useCallback(() => {
    const newFlagValue = !isFlatCommentsMode;
    setIsFlatCommentsMode(newFlagValue);
    setflatModeOnLocalStorage(newFlagValue);
    dispatch({
      type: actions.SORT,
      sortOption
    });
  }, [isFlatCommentsMode, setflatModeOnLocalStorage, sortOption]);

  const numOfDuplicatedComments = numOfComments - state.comments.length;
  const hasDuplicatedComments =
    !!state.comments.length && numOfDuplicatedComments > 0;

  const singleThreadCommentCannotBeAccessed =
    isSingleThread &&
    ((comments && !comments.find((c) => c.commentid === +threadParentID)) ||
      numOfComments === 0);

  const handleCommentVote = useCallback(
    (commentID, action) =>
      recordTokenFull
        ? onCommentVote(commentID, action, recordTokenFull)
        : null,
    [onCommentVote, recordTokenFull]
  );

  return (
    <>
      <Card
        id="commentArea"
        className={classNames(styles.commentAreaContainer, className)}>
        <div className={classNames("container", styles.commentsHeaderWrapper)}>
          <LoggedInContent
            fallback={
              <WhatAreYourThoughts
                onLoginClick={handleOpenLoginModal}
                onSignupClick={onRedirectToSignup}
              />
            }>
            <Or>
              {readOnly && (
                <Message kind="blocked" title={"Comments are not allowed"}>
                  {readOnlyReason}
                </Message>
              )}
              {!isPaid && paywallEnabled && currentUser && (
                <Message kind="error">
                  <P>
                    You won't be able to submit comments or proposals before
                    paying the paywall, please visit your{" "}
                    <Link to={`/user/${userid}?tab=credits`}>account</Link> page
                    to correct this problem.
                  </P>
                </Message>
              )}
              {!readOnly && !!identityError && <IdentityMessageError />}
            </Or>
            {!isSingleThread && !readOnly && recordTokenFull && (
              <CommentForm
                persistKey={`commenting-on-${recordToken}`}
                onSubmit={handleSubmitComment}
                disableSubmit={!!identityError || paywallMissing}
              />
            )}
          </LoggedInContent>
          {error && (
            <Message kind="error" className="margin-top-m">
              {error.toString()}
            </Message>
          )}
          <div className={styles.commentsHeader}>
            {!isSingleThread && (
              <div className={styles.titleWrapper}>
                <H2 className={styles.commentsTitle}>
                  Comments{" "}
                  <span className={styles.commentsCount}>{commentsCount}</span>
                </H2>
                {hasDuplicatedComments && (
                  <Text
                    color="gray"
                    size="small">{`(${numOfDuplicatedComments} duplicate comments omitted)`}</Text>
                )}
              </div>
            )}
            <div className={styles.sortContainer}>
              {!!comments && !!comments.length && (
                <>
                  {!isSingleThread && (
                    <div className={styles.modeToggleWrapper}>
                      <Toggle
                        onToggle={handleCommentsModeToggle}
                        toggled={isFlatCommentsMode}
                      />
                      <div
                        onClick={handleCommentsModeToggle}
                        className={styles.modeToggleLabel}>
                        Flat Mode
                      </div>
                    </div>
                  )}
                  <Select
                    value={selectValue}
                    onChange={handleSetSortOption}
                    options={selectOptions}
                  />
                </>
              )}
            </div>
            {isSingleThread && (
              <div className="justify-right">
                <Text className="margin-right-xs">Single comment thread. </Text>
                <Link to={`/record/${recordToken}`}> View all.</Link>
              </div>
            )}
          </div>
        </div>
        <div className={styles.commentsWrapper}>
          {loading ? (
            commentLoaders
          ) : !singleThreadCommentCannotBeAccessed ? (
            <CommentContext.Provider
              value={{
                onSubmitComment,
                onCommentVote: handleCommentVote,
                recordAuthorID,
                recordAuthorUsername,
                recordToken,
                threadParentID,
                recordType,
                proposalState,
                readOnly,
                identityError,
                paywallMissing,
                isAdmin: currentUser && currentUser.isadmin,
                currentUser,
                openCensorModal: handleCensorCommentModal,
                openLoginModal: handleOpenLoginModal,
                ...commentsCtx
              }}>
              <CommentsListWrapper
                lastTimeAccessed={lastVisitTimestamp}
                threadParentID={threadParentID}
                currentUserID={currentUser && currentUser.userid}
                comments={state.comments}
                isFlatMode={isFlatCommentsMode}
                proposalState={proposalState}
                recordsBaseLink={recordBaseLink}
              />
            </CommentContext.Provider>
          ) : null}
          {singleThreadCommentCannotBeAccessed && (
            <Message kind="error">
              The comment you are trying to access does not exist or it is a
              duplicated. Return to the full thread to select a valid comment.
            </Message>
          )}
        </div>
      </Card>
    </>
  );
};

export default withRouter(Comments);
