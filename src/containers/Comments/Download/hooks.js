import { createContext, useContext } from "react";
import * as sel from "src/selectors";
import { useSelector } from "src/redux";

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

export function useDownloadComments() {
  const comments = useSelector(sel.proposalComments);
  return { comments };
}
