import React, { useEffect, useReducer, useCallback, useMemo } from "react";
import { Card, H2, Text, Message, classNames } from "pi-ui";
import { withRouter } from "react-router-dom";
import styles from "./Comments.module.css";
import LoggedInContent from "src/componentsv2/LoggedInContent";
import CommentForm from "src/componentsv2/CommentForm";
import { useComments, CommentContext } from "./hooks";
import CommentsListWrapper from "./CommentsList/CommentsListWrapper";
import CommentLoader from "./Comment/CommentLoader";
import Link from "src/componentsv2/Link";
import Select from "src/componentsv2/Select";
import Or from "src/componentsv2/Or";
import useQueryString from "src/hooks/utils/useQueryString";
import {
  getSortOptionsForSelect,
  createSelectOptionFromSortOption,
  commentSortOptions,
  NUMBER_OF_LIST_PLACEHOLDERS
} from "./helpers";
import useIdentity from "src/hooks/api/useIdentity";
import usePaywall from "src/hooks/api/usePaywall";
import { IdentityMessageError } from "src/componentsv2/IdentityErrorIndicators";
import { useLoginModal } from "src/containers/User/Login";
import WhatAreYourThoughts from "src/componentsv2/WhatAreYourThoughts";
import { commentsReducer, initialState, actions } from "./commentsReducer";
import { getQueryStringValue } from "src/lib/queryString";

const Comments = ({
  numOfComments,
  recordToken,
  recordAuthorID,
  threadParentID,
  readOnly,
  readOnlyReason,
  className,
  history
}) => {
  const [, identityError] = useIdentity();
  const { isPaid, paywallEnabled } = usePaywall();
  const [state, dispatch] = useReducer(commentsReducer, initialState);
  const [sortOption, setSortOption] = useQueryString(
    "sort",
    commentSortOptions.SORT_BY_TOP
  );
  const {
    onSubmitComment,
    comments,
    onLikeComment,
    loading,
    recordType,
    lastVisitTimestamp,
    currentUser,
    ...commentsCtx
  } = useComments({
    recordToken,
    numOfComments
  });

  const [, , openLoginModal, closeLoginModal] = useLoginModal();

  const handleOpenLoginModal = useCallback(() => {
    openLoginModal("commentsLoginModal", {
      onLoggedIn: closeLoginModal
    });
  }, [openLoginModal, closeLoginModal]);

  const onRedirectToSignup = () => {
    history.push("/user/signup");
  };

  const paywallMissing = paywallEnabled && !isPaid;
  const isSingleThread = !!threadParentID;

  const handleSubmitComment = useCallback(
    comment => {
      return onSubmitComment({
        comment,
        token: recordToken,
        parentID: 0
      });
    },
    [recordToken, onSubmitComment]
  );

  const handleSetSortOption = useCallback(
    option => {
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

  const scrollToComments = getQueryStringValue("scrollToComments");
  useEffect(
    function handleScrollToComments() {
      if (scrollToComments) {
        document.getElementById("commentArea").scrollIntoView();
      }
    },
    [scrollToComments]
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

  return (
    <>
      <Card
        id="commentArea"
        className={classNames(styles.commentAreaContainer, className)}
      >
        <div className={classNames("container", styles.commentsHeaderWrapper)}>
          <LoggedInContent
            fallback={
              <WhatAreYourThoughts
                onLoginClick={handleOpenLoginModal}
                onSignupClick={onRedirectToSignup}
              />
            }
          >
            <Or>
              {readOnly && (
                <Message kind="blocked" title={"Comments are not allowed"}>
                  {readOnlyReason}
                </Message>
              )}
              {!isPaid && paywallEnabled && (
                <Message kind="error">
                  You must pay the paywall to submit comments.
                </Message>
              )}
              {!readOnly && !!identityError && <IdentityMessageError />}
            </Or>
            {!isSingleThread && !readOnly && (
              <CommentForm
                persistKey={`commenting-on-${recordToken}`}
                onSubmit={handleSubmitComment}
                disableSubmit={!!identityError || paywallMissing}
              />
            )}
          </LoggedInContent>
          <div className={styles.commentsHeader}>
            {!isSingleThread && (
              <H2 className={styles.commentsTitle}>
                Comments{" "}
                <span className={styles.commentsCount}>
                  {state.comments.length || numOfComments}
                </span>
              </H2>
            )}
            <div className={styles.sortContainer}>
              {!!comments && !!comments.length && (
                <Select
                  isSearchable={false}
                  value={selectValue}
                  onChange={handleSetSortOption}
                  options={selectOptions}
                />
              )}
            </div>
            {isSingleThread && (
              <div className="justify-right">
                <Text className="margin-right-xs">Single comment thread. </Text>
                <Link to={`/${recordType}/${recordToken}`}> View all.</Link>
              </div>
            )}
          </div>
        </div>
        <div className={styles.commentsWrapper}>
          {loading ? (
            commentLoaders
          ) : (
            <CommentContext.Provider
              value={{
                onSubmitComment,
                onLikeComment,
                recordAuthorID,
                recordToken,
                threadParentID,
                recordType,
                readOnly,
                identityError,
                paywallMissing,
                openLoginModal: handleOpenLoginModal,
                ...commentsCtx
              }}
            >
              <CommentsListWrapper
                lastTimeAccessed={lastVisitTimestamp}
                threadParentID={threadParentID}
                currentUserID={currentUser && currentUser.userid}
                comments={state.comments}
              />
            </CommentContext.Provider>
          )}
        </div>
      </Card>
    </>
  );
};

export default withRouter(Comments);
