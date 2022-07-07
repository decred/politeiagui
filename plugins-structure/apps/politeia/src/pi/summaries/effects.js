import { piSummaries } from "./";

export async function fetchRecordPiSummaries(state, dispatch, { token }) {
  const hasPiSummaries = piSummaries.selectByToken(state, token);
  const summariesStatus = piSummaries.selectStatus(state);
  if (!hasPiSummaries && summariesStatus !== "loading")
    await dispatch(piSummaries.fetch({ tokens: [token] }));
}
