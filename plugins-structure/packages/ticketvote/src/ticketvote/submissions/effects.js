import { ticketvoteSubmissions } from "./";

export async function fetchRecordTicketvoteSubmissions(
  state,
  dispatch,
  { token }
) {
  const hasSubmissions = ticketvoteSubmissions.selectByToken(state, token);
  if (!hasSubmissions) {
    await dispatch(ticketvoteSubmissions.fetch({ token }));
  }
}
