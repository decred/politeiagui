import { useEffect } from "react";

export const useDCCComments = ({
  dcc,
  token,
  comments,
  onSubmitComment,
  onFetchComments,
  commentid,
  loggedInAsEmail,
  commentsError
}) => {
  useEffect(() => {
    onFetchComments(token);
  }, [onFetchComments, token]);

  return {
    comments,
    dcc,
    onSubmitComment,
    onFetchData: onFetchComments,
    token,
    commentid,
    loggedInAsEmail,
    error: commentsError
  };
};
