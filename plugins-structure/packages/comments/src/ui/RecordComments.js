import React from "react";
import { commentsHooks } from "../comments";

const RecordComments = ({ token }) => {
  const { comments, commentsStatus, commentsError, onFetchComments } =
    commentsHooks.useComments({ token, initialFetch: true });

  return (
    <div>
      <h1>RECORD COMMENTS {token}</h1>
      {comments && JSON.stringify(comments, null, "\n\n")}
    </div>
  );
};

export default RecordComments;
