import { piSummaries } from "./";

export async function fetchRecordPiSummaries(state, dispatch, { token }) {
  const hasPiSummaries = piSummaries.selectByToken(state, token);
  if (!hasPiSummaries) await dispatch(piSummaries.fetch({ tokens: [token] }));
}
