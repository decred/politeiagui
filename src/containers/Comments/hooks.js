import { createContext, useContext } from "react";

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);
