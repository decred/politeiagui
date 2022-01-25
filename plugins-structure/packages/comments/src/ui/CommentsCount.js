import React from "react";
import { commentsCount } from "../comments/count";

const CommentsCount = ({ tokens }) => {
  const { count } = commentsCount.useFetch({
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
