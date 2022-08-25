import { downloadJSON } from "@politeiagui/core/downloads";
import { commentsTimestamps } from "@politeiagui/comments/timestamps";

export function downloadCommentsTimestampsEffect({ payload }, { getState }) {
  const state = getState();
  const { token } = payload;
  const commentsToDownload = commentsTimestamps.selectByToken(state, token);
  downloadJSON(commentsToDownload, `comments-timestamps-${token}`);
}
