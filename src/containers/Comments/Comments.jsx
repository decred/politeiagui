import React, { useEffect, useReducer, useState } from "react";
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
import useQueryString from "src/hooks/useQueryString";
import {
  getSortOptionsForSelect,
  createSelectOptionFromSortOption,
  commentSortOptions,
  NUMBER_OF_LIST_PLACEHOLDERS
} from "./helpers";
import useIdentity from "src/hooks/useIdentity";
import usePaywall from "src/hooks/usePaywall";
import { IdentityMessageError } from "src/componentsv2/IdentityErrorIndicators";
import ModalLogin from "src/componentsv2/ModalLogin";
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
    ...commentsCtx
  } = useComments({
    recordToken,
    numOfComments
  });
  const [loginModalShow, setLoginModalShow] = useState(false);
  const handleOpenLoginModal = () => setLoginModalShow(true);
  const handleCloseLoginModal = () => setLoginModalShow(false);

  const onRedirectToSignup = () => {
    history.push("/user/signup");
  };

  const paywallMissing = paywallEnabled && !isPaid;
  const isSingleThread = !!threadParentID;

  function handleSubmitComment(comment) {
    return onSubmitComment({
      comment,
      token: recordToken,
      parentID: 0
    });
  }

  function handleSetSortOption(option) {
    setSortOption(option.value);
    dispatch({
      type: actions.SORT,
      sortOption: option.value
    });
  }

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

  function renderCommentLoaders() {
    const numOfContents =
      numOfComments < 3 ? numOfComments : NUMBER_OF_LIST_PLACEHOLDERS;
    const contents = [];
    for (let i = 0; i < numOfContents; i++) {
      contents.push(<CommentLoader key={`comment-loader-${i}`} />);
    }
    return contents;
  }
  return (
    <>
      <Card
        id="commentArea"
        className={classNames(
          "container",
          styles.commentAreaContainer,
          className
        )}
      >
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
                value={createSelectOptionFromSortOption(sortOption)}
                onChange={handleSetSortOption}
                options={getSortOptionsForSelect()}
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
        {loading ? (
          renderCommentLoaders()
        ) : (
          <div className="margin-top-m">
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
                threadParentID={threadParentID}
                comments={state.comments}
              />
            </CommentContext.Provider>
          </div>
        )}
      </Card>
      <ModalLogin show={loginModalShow} onLoggedIn={handleCloseLoginModal} onClose={handleCloseLoginModal} />
    </>
  );
};

export default withRouter(Comments);
