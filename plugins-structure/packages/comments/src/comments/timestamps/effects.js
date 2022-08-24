import { commentsTimestamps } from "./";
import { recordComments } from "../comments";
import chunk from "lodash/chunk";
import toSafeInteger from "lodash/toSafeInteger";

export async function fetchRecordCommentsTimestampsEffect(
  state,
  dispatch,
  { token }
) {
  const {
    commentsPolicy: {
      policy: { timestampspagesize },
    },
  } = state;
  const recordCommentsTimestamps = commentsTimestamps.selectByToken(
    state,
    token
  );
  const comments = recordComments.selectByToken(state, token);
  if (!comments || recordCommentsTimestamps) return;

  const ids = Object.keys(comments).map(toSafeInteger);
  const pages = chunk(ids, timestampspagesize);
  // Fetch all timestamps first
  await Promise.all(
    pages.map((page) =>
      dispatch(commentsTimestamps.fetch({ token, commentids: page }))
    )
  );
  // Indicate whether all comments timestamps were fetched for given record
  dispatch(commentsTimestamps.setDone({ token, commentids: ids }));
}
