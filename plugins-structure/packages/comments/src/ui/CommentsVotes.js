import React from "react";
import { commentsVotes } from "../comments/votes";

export const CommentsVotes = ({ token, userId }) => {
  const { votes } = commentsVotes.useFetch({ token, userId });

  return <div>{JSON.stringify(votes, null, "\n")}</div>;
};
