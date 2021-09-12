import React, {
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useState
} from "react";
import {
  Card,
  H2,
  Text,
  Message,
  classNames,
  P,
  Select,
  Icon,
  Tooltip
} from "pi-ui";
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
import { debounce } from "lodash";

const COMMENTS_LOGIN_MODAL_ID = "commentsLoginModal";

const FlatModeButton = ({ isActive, onClick }) => (
  <>
    <div
      className={classNames(
        styles.flatButtonWrapper,
        isActive && styles.flatModeActive
      )}
      onClick={onClick}>
      <Text
        className={classNames(
          styles.flatButtonText,
          isActive && styles.flatModeActive
        )}>
        Flat mode
      </Text>
    </div>
    <div>
      <Tooltip
          className={styles.flatTooltipWrapper}
          contentClassName={styles.flatModTooltip}
          content={
            (
                <>
                  <p>Flat mode flattens out the comment hierarchy so that filtering criteria can be applied to both top level comments and comment replies equally.</p>
                  <p>When flat mode is turned off, filtering criteria is only applied to top level comments.</p>
                </>
            )
          }>
        <Icon type="info" />
      </Tooltip>
    </div>
  </>
);

const CommentsListAndActions = ({
  sortOption,
  setSortOption,
  dispatch,
  comments,
  numOfComments,
  state,
  threadParentID,
  isSingleThread,
  recordTokenFull,
  onCommentVote,
  recordToken,
  recordType,
  lastVisitTimestamp,
  commentsCtx,
  onCensorComment,
  currentUser,
  proposalState,
  handleOpenModal,
  handleCloseModal,
  loading,
  recordAuthorID,
  recordAuthorUsername,
  recordBaseLink,
  onSubmitComment,
  readOnly,
  identityError,
  paywallMissing,
  handleOpenLoginModal
}) => {
  const { userid } = currentUser || {};
  const commentsCount = comments ? comments.length : 0;
  const numOfDuplicatedComments = numOfComments - state.comments.length;
  const hasDuplicatedComments =
    !!state.comments.length && numOfDuplicatedComments > 0;
  /** SORT START */
  const handleSetSortOption = useCallback(
    (option) => {
      setSortOption(option.value);
      dispatch({
        type: actions.SORT,
        sortOption: option.value
      });
    },
    [dispatch, setSortOption]
  );

  const selectOptions = useMemo(() => getSortOptionsForSelect(), []);
  const selectValue = useMemo(
    () => createSelectOptionFromSortOption(sortOption),
    [sortOption]
  );
  /** SORT END */
  /** FLAT MODE START */
  const [flatModeOnLocalStorage, setflatModeOnLocalStorage] = useLocalStorage(
    "flatComments",
    false
  );
  const [isFlatCommentsMode, setIsFlatCommentsMode] = useState(
    flatModeOnLocalStorage
  );

  const handleCommentsModeToggle = () => {
    const newFlagValue = !isFlatCommentsMode;
    setIsFlatCommentsMode(newFlagValue);
    setflatModeOnLocalStorage(newFlagValue);
    dispatch({
      type: actions.SORT,
      sortOption
    });
  };
  const debouncedHandleCommentsModeToggle = debounce(
    handleCommentsModeToggle,
    50
  );
  /** FLAT MODE END */
  /** VOTE START */
  const handleCommentVote = useCallback(
    (commentID, action) =>
      recordTokenFull
        ? onCommentVote(commentID, action, recordTokenFull)
        : null,
    [onCommentVote, recordTokenFull]
  );
  /** VOTE END */
  /** CENSOR START */
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
  /** CENSOR END */
  /** LOADERS START */
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
  /** LOADERS END */
  /** SINGLE THREAD VERIFICATION START */
  const singleThreadCommentCannotBeAccessed =
    isSingleThread &&
    ((comments && !comments.find((c) => c.commentid === +threadParentID)) ||
      numOfComments === 0);
  /** SINGLE THREAD VERIFICATION END */
  return (
    <>
      <div className={classNames("container", styles.commentsHeader)}>
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
              <Select
                value={selectValue}
                onChange={handleSetSortOption}
                options={selectOptions}
              />
              {!isSingleThread && (
                <FlatModeButton
                  isActive={isFlatCommentsMode}
                  onClick={debouncedHandleCommentsModeToggle}
                />
              )}
            </>
          )}
        </div>
        {isSingleThread && (
          <div className="justify-left margin-top-s">
            <Text className="margin-right-xs">Single comment thread. </Text>
            <Link to={`/record/${recordToken}?scrollToComments=true`}>
              View all.
            </Link>
          </div>
        )}
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
    </>
  );
};

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

  const hasComments = !!comments;
  const hasScrollToQuery = !!getQueryStringValue("scrollToComments");
  const shouldScrollToComments =
    (hasScrollToQuery || isSingleThread) && hasComments;
  useScrollTo("commentArea", shouldScrollToComments);

  const [sortOption, setSortOption] = useQueryString(
    "sort",
    commentSortOptions.SORT_BY_TOP
  );

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

  const handleOpenLoginModal = useCallback(() => {
    handleOpenModal(ModalLogin, {
      id: COMMENTS_LOGIN_MODAL_ID,
      onLoggedIn: handleCloseModal
    });
  }, [handleOpenModal, handleCloseModal]);

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
        </div>
        <CommentsListAndActions
          sortOption={sortOption}
          setSortOption={setSortOption}
          dispatch={dispatch}
          comments={comments}
          numOfComments={numOfComments}
          state={state}
          threadParentID={threadParentID}
          isSingleThread={isSingleThread}
          recordTokenFull={recordTokenFull}
          onCommentVote={onCommentVote}
          recordToken={recordToken}
          recordType={recordType}
          lastVisitTimestamp={lastVisitTimestamp}
          commentsCtx={commentsCtx}
          onCensorComment={onCensorComment}
          userid={userid}
          currentUser={currentUser}
          proposalState={proposalState}
          handleOpenModal={handleOpenModal}
          handleCloseModal={handleCloseModal}
          loading={loading}
          recordAuthorID={recordAuthorID}
          recordAuthorUsername={recordAuthorUsername}
          recordBaseLink={recordBaseLink}
          onSubmitComment={onSubmitComment}
          readOnly={readOnly}
          identityError={identityError}
          paywallMissing={paywallMissing}
          handleOpenLoginModal={handleOpenLoginModal}
        />
      </Card>
    </>
  );
};

export default withRouter(Comments);
