import { createContext, useContext, useMemo } from "react";
import * as sel from "src/selectors";
import { useSelector } from "src/redux";
import useTimestamps from "src/hooks/api/useTimestamps";

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

export function useDownloadComments(token) {
  const commentsSelector = useMemo(() => sel.makeGetRecordComments(token), [
    token
  ]);
  const comments = useSelector(commentsSelector);
  const { onFetchCommentsTimestamps } = useTimestamps();

  return { comments, onFetchCommentsTimestamps };
}
