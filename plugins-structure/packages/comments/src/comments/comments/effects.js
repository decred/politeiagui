import { recordComments } from "./";

export async function fetchRecordComments(state, dispatch, { token }) {
  const hasComments = recordComments.selectByToken(state, token);
  if (!hasComments) await dispatch(recordComments.fetch({ token: token }));
}
