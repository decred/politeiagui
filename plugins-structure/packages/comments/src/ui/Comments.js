import React from "react";
import { commentsHooks } from "../comments";

const RecordComments = ({ token }) => {
  const { comments } = commentsHooks.useComments({ token, initialFetch: true });

  return <div>{comments && JSON.stringify(comments, null, "\n\n")}</div>;
};

export default RecordComments;
