import { createContext, useContext, useMemo } from "react";
import * as sel from "src/selectors";
import { useSelector } from "src/redux";

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

export function useDownloadComments(token) {
  const commentsSelector = useMemo(() => sel.makeGetProposalComments(token), [
    token
  ]);
  const comments = useSelector(commentsSelector);
  return { comments };
}
