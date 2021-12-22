import React from "react";
import { commentsHooks } from "../comments";

const CommentsCount = ({ tokens }) => {
  const { count } = commentsHooks.useCount({
    tokens,
    initialFetch: true,
  });
  return (
    <div>
      {count &&
        tokens &&
        tokens.map((token, i) => (
          <div key={i}>
            {token}: {count[token]}
          </div>
        ))}
    </div>
  );
};

export default CommentsCount;
