import React from "react";
import { commentsHooks } from "../comments";

const CommentsVotes = ({ token, userId }) => {
  const { votes } = commentsHooks.useVotes({
    token,
    userId,
    initialFetch: true,
  });

  return <div>{JSON.stringify(votes, null, "\n")}</div>;
};

export default CommentsVotes;
