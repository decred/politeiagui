import { commentsComments } from "./comments";
import { useRecordComments } from "./comments/useComments";

export const comments = {
  comments: commentsComments,
};

export const commentsHooks = {
  useComments: useRecordComments,
};
