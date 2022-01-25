import React from "react";
import { commentsVotes } from "../comments/votes";

const CommentsVotes = ({ token, userId }) => {
  const { votes } = commentsVotes.useFetch({
    token,
    userId,
    initialFetch: true,
  });

  return <div>{JSON.stringify(votes, null, "\n")}</div>;
};

export default CommentsVotes;
