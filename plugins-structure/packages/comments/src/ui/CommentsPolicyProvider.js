import React, { createContext } from "react";
import { commentsPolicy } from "../comments/policy";

export const commentsPolicyContext = createContext();

const CommentsPolicyProvider = ({ children }) => {
  const { policy } = commentsPolicy.useFetch({ initialFetch: true });

  return (
    <commentsPolicyContext.Provider value={{ commentsPolicy: policy }}>
      {children}
    </commentsPolicyContext.Provider>
  );
};

export default CommentsPolicyProvider;
