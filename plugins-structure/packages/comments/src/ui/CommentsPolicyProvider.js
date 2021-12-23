import React, { createContext } from "react";
import { commentsHooks } from "../comments";

export const commentsPolicyContext = createContext();

const CommentsPolicyProvider = ({ children }) => {
  const { policy } = commentsHooks.usePolicy({ initialFetch: true });

  return (
    <commentsPolicyContext.Provider value={{ commentsPolicy: policy }}>
      {children}
    </commentsPolicyContext.Provider>
  );
};

export default CommentsPolicyProvider;
