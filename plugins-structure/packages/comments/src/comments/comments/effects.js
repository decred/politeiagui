import { recordComments } from "./";

export async function fetchRecordComments(state, dispatch, { token }) {
  const hasComments = recordComments.selectByToken(state, token);
  const commentsStatus = recordComments.selectStatus(state);
  if (!hasComments && commentsStatus !== "loading")
    await dispatch(recordComments.fetch({ token: token }));
}
