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
  Select,
  Icon,
  Tooltip
} from "pi-ui";
import styles from "./Comments.module.css";
import ModalConfirmWithReason from "src/components/ModalConfirmWithReason";
import { CommentContext } from "./hooks";
import CommentsListWrapper from "./CommentsList/CommentsListWrapper";
import CommentLoader from "./Comment/CommentLoader";
import Link from "src/components/Link";
import { useComments, useLocalStorage } from "src/hooks";
import {
  getSortOptionsForSelect,
  createSelectOptionFromSortOption,
  commentSortOptions,
  handleCommentCensoringInfo,
  NUMBER_OF_LIST_PLACEHOLDERS
} from "./helpers";
import { PROPOSAL_MAIN_THREAD_KEY } from "src/constants";
import { commentsReducer, initialState, actions } from "./commentsReducer";
import { debounce } from "lodash";

const FlatModeButton = ({ isActive, onClick }) => (
  <>
    <div
      className={classNames(
        styles.flatButtonWrapper,
        isActive && styles.flatModeActive
      )}
      onClick={onClick}
    >
      <Text
        className={classNames(
          styles.flatButtonText,
          isActive && styles.flatModeActive
        )}
      >
        Flat mode
      </Text>
    </div>
    <div>
      <Tooltip
        className={styles.flatTooltipWrapper}
        contentClassName={styles.flatModTooltip}
        content={
          <>
            <p>
              Flat mode flattens out the comment hierarchy so that filtering
              criteria can be applied to both top level comments and comment
              replies equally.
            </p>
            <p>
              When flat mode is turned off, filtering criteria is only applied
              to top level comments.
            </p>
          </>
        }
      >
        <Icon type="info" />
      </Tooltip>
    </div>
  </>
);

const CommentsListAndActions = React.memo(
  ({
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
    userid,
    proposalState,
    handleOpenModal,
    handleCloseModal,
    loading,
    recordAuthorID,
    recordAuthorUsername,
    recordBaseLink,
    onSubmitComment,
    onEditComment,
    readOnly,
    identityError,
    paywallMissing,
    handleOpenLoginModal,
    latestAuthorUpdateId,
    areAuthorUpdatesAllowed,
    authorUpdateTitle,
    sectionId
  }) => {
    const {
      getCommentLikeOption,
      enableCommentVote,
      userLoggedIn,
      userEmail,
      loadingLikes,
      getCommentVotes
    } = commentsCtx;
    const commentsCount = comments ? comments.length : 0;
    const numOfDuplicatedComments = numOfComments - state.comments.length;
    const hasDuplicatedComments =
      !!state.comments.length && numOfDuplicatedComments > 0;
    /** EDIT MODE START */
    const [editCommentID, setEditCommentID] = useState(null);
    const isEditing = !!editCommentID;
    /** EDIT MODE END*/
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
          proposalState,
          sectionId
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
        handleCloseModal,
        sectionId
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
        {!isEditing && (
          <div className={classNames("container", styles.commentsHeader)}>
            {!isSingleThread && (
              <div className={styles.titleWrapper}>
                <H2 className={styles.commentsTitle}>
                  {authorUpdateTitle ? authorUpdateTitle : "Comments"}{" "}
                  <span
                    className={styles.commentsCount}
                  >{`(${commentsCount})`}</span>
                </H2>
                {hasDuplicatedComments && (
                  <Text
                    color="gray"
                    size="small"
                  >{`(${numOfDuplicatedComments} duplicate comments omitted)`}</Text>
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
        )}
        <div className={styles.commentsWrapper}>
          {loading ? (
            commentLoaders
          ) : !singleThreadCommentCannotBeAccessed ? (
            <CommentContext.Provider
              value={{
                onSubmitComment,
                onEditComment,
                editCommentID,
                setEditCommentID,
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
                latestAuthorUpdateId,
                areAuthorUpdatesAllowed,
                comments,
                getCommentLikeOption,
                enableCommentVote,
                userLoggedIn,
                userEmail,
                loadingLikes,
                getCommentVotes,
                sectionId
              }}
            >
              <CommentsListWrapper
                lastTimeAccessed={lastVisitTimestamp}
                threadParentID={threadParentID}
                currentUserID={userid}
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
  }
);

const Comments = ({
  recordToken,
  recordTokenFull,
  recordAuthorID,
  recordAuthorUsername,
  threadParentID,
  readOnly,
  className,
  proposalState,
  recordBaseLink,
  areAuthorUpdatesAllowed,
  handleOpenModal,
  handleCloseModal,
  handleOpenLoginModal,
  paywallMissing,
  identityError,
  sectionId
}) => {
  const isSingleThread = !!threadParentID;
  const {
    onSubmitComment,
    onEditComment,
    onCommentVote,
    onCensorComment,
    comments,
    loading,
    recordType,
    lastVisitTimestamp,
    currentUser,
    getCommentLikeOption,
    enableCommentVote,
    userLoggedIn,
    userEmail,
    loadingLikes,
    getCommentVotes,
    latestAuthorUpdateId
  } = useComments(recordTokenFull, proposalState, sectionId, threadParentID);
  const { userid } = currentUser || {};
  const numOfComments = comments?.length;

  const [state, dispatch] = useReducer(commentsReducer, initialState);

  const [sortOption, setSortOption] = useLocalStorage(
    `sortComments-${recordToken}`,
    commentSortOptions.SORT_BY_TOP
  );

  const authorUpdateTitle = useCallback(
    (updateId) => {
      const { extradata } = comments.find(
        ({ commentid }) => commentid === updateId
      );
      const authorUpdateMetadata = JSON.parse(extradata);
      return authorUpdateMetadata.title;
    },
    [comments]
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

  const updateTitle = useMemo(() => {
    if (sectionId && sectionId !== PROPOSAL_MAIN_THREAD_KEY && !isSingleThread)
      return authorUpdateTitle(sectionId);
  }, [sectionId, authorUpdateTitle, isSingleThread]);

  return (
    <>
      {comments && (
        <Card
          id="commentArea"
          className={classNames(styles.commentAreaContainer, className)}
        >
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
            commentsCtx={{
              getCommentLikeOption,
              enableCommentVote,
              userLoggedIn,
              userEmail,
              loadingLikes,
              getCommentVotes
            }}
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
            onEditComment={onEditComment}
            readOnly={readOnly}
            identityError={identityError}
            paywallMissing={paywallMissing}
            handleOpenLoginModal={handleOpenLoginModal}
            latestAuthorUpdateId={latestAuthorUpdateId}
            areAuthorUpdatesAllowed={areAuthorUpdatesAllowed}
            authorUpdateTitle={updateTitle}
            sectionId={sectionId}
          />
        </Card>
      )}
    </>
  );
};

export default React.memo(Comments);
